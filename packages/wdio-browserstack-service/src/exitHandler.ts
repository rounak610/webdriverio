import { spawn } from 'node:child_process'
import path from 'node:path'
import BrowserStackConfig from './config.js'
import { saveFunnelData } from './instrumentation/funnelInstrumentation.js'
import { fileURLToPath } from 'node:url'
import { BROWSERSTACK_TESTHUB_JWT } from './constants.js'
import { BStackLogger } from './bstackLogger.js'
import PerformanceTester from './instrumentation/performance/performance-tester.js'
import TestOpsConfig from './testOps/testOpsConfig.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function getInterruptSignals(): string[] {
    const allSignals: string[] = [
        'SIGTERM',
        'SIGINT',
        'SIGHUP'
    ]
    if (process.platform !== 'win32') {
        allSignals.push('SIGABRT')
        allSignals.push('SIGQUIT')
    } else {
        // For windows Ctrl+Break
        allSignals.push('SIGBREAK')
    }
    return allSignals
}

export function setupExitHandlers() {
    // Capture stack trace BEFORE exit occurs
    const originalExit = process.exit
    process.exit = function(code) {
        const exitStack = new Error().stack
        BStackLogger.debug(`ACTUAL process.exit() called from: ${exitStack}`)
        return originalExit.call(this, code)
    }

    process.on('exit', (code) => {
        BStackLogger.debug(`Exit hook called with code: ${code}`)
        const args = shouldCallCleanup(BrowserStackConfig.getInstance())
        if (Array.isArray(args) && args.length) {
            BStackLogger.debug('Spawning cleanup with args ' + args.toString())
            const childProcess = spawn('node', [`${path.join(__dirname, 'cleanup.js')}`, ...args], { detached: true, stdio: 'inherit', env: { ...process.env } })
            childProcess.unref()
            originalExit.call(process, code)
        }
    })

    getInterruptSignals().forEach((sig: string) => {
        process.on(sig, () => {
            const signalStack = new Error().stack
            BStackLogger.debug(`Signal ${sig} received from: ${signalStack}`)

            // Add specific context for each signal type
            switch (sig) {
            case 'SIGTERM':
                BStackLogger.debug('SIGTERM - likely Jenkins timeout or external kill')
                break
            case 'SIGINT':
                BStackLogger.debug('SIGINT - likely Ctrl+C or user interruption')
                break
            case 'SIGHUP':
                BStackLogger.debug('SIGHUP - likely terminal closed or session ended')
                break
            case 'SIGABRT':
                BStackLogger.debug('SIGABRT - likely process abort or assertion failure')
                break
            case 'SIGQUIT':
                BStackLogger.debug('SIGQUIT - likely Ctrl+\\ or quit signal')
                break
            case 'SIGBREAK':
                BStackLogger.debug('SIGBREAK - likely Ctrl+Break on Windows')
                break
            default:
                BStackLogger.debug(`Unknown signal: ${sig}`)
            }

            BrowserStackConfig.getInstance().setKillSignal(sig)
        })
    })

    // Track ALL ways the process can terminate
    process.on('uncaughtException', (err) => {
        BStackLogger.error(`Uncaught Exception causing exit: ${err.message}`)
        BStackLogger.error(`Stack: ${err.stack}`)
    })

    process.on('unhandledRejection', (reason, promise) => {
        BStackLogger.error(`Unhandled Rejection causing potential exit: ${reason}`)
        BStackLogger.error(`Promise: ${promise}`)
    })
}

export function shouldCallCleanup(config: BrowserStackConfig): string[] {
    const args: string[] = []
    if (!!process.env[BROWSERSTACK_TESTHUB_JWT] && !config.testObservability.buildStopped) {
        args.push('--observability')
    }

    if (config.userName && config.accessKey && !config.funnelDataSent) {
        const savedFilePath = saveFunnelData('SDKTestSuccessful', config)
        args.push('--funnelData', savedFilePath)
    }

    if (PerformanceTester.isEnabled()) {
        process.env.PERF_USER_NAME = config.userName
        process.env.PERF_TESTHUB_UUID = TestOpsConfig.getInstance().buildHashedId
        process.env.PERF_SDK_RUN_ID = config.sdkRunID
        args.push('--performanceData')
    }

    return args
}
