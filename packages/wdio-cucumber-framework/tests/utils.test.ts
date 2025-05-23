import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { Status } from '@cucumber/cucumber'
import {
    createStepArgument,
    formatMessage,
    getStepType,
    getFeatureId,
    buildStepPayload,
    getTestStepTitle,
    addKeywordToStep,
    getRule,
    generateSkipTagsFromCapabilities,
    convertStatus
} from '../src/utils.js'
import { featureWithRules } from './fixtures/features.js'

vi.mock('@wdio/logger', () => import(path.join(process.cwd(), '__mocks__', '@wdio/logger')))

describe('utils', () => {
    describe('createStepArgument', () => {
        it('Works without argument', () => {
            expect(typeof createStepArgument({} as any)).toBe('undefined')
        })

        it('Works with unexpected type', () => {
            expect(typeof createStepArgument({ argument: { } } as any))
                .toBe('undefined')
        })

        it('Works with DataTable', () => {
            expect(createStepArgument({
                argument: {
                    dataTable: {
                        rows: [
                            { cells: [{ value: '1' }, { value: '2' }] },
                            { cells: [{ value: '3' }, { value: '4' }] },
                            { cells: [{ value: '5' }, { value: '6' }] }
                        ]
                    }
                }
            } as any)).toMatchSnapshot()
        })

        it('Works with DocString', () => {
            expect(createStepArgument({
                argument: {
                    docString: {
                        content: 'some string content'
                    }
                }
            } as any)).toEqual('some string content')
        })
    })

    describe('formatMessage', () => {
        it('should set passed state for test hooks', () => {
            expect(formatMessage({
                payload: { state: 'passed' }
            })).toMatchSnapshot()
        })

        it('should not fail if payload was not passed', () => {
            expect(formatMessage({})).toEqual({})
        })

        it('should set fullTitle', () => {
            expect(formatMessage({
                payload: { parent: 'foo', title: 'bar' }
            })).toEqual({
                parent: 'foo',
                title: 'bar',
                fullTitle: 'foo: bar',
            })
        })
    })

    describe('getTestStepTitle', () => {
        it('should determine a correct title', () => {
            expect(getTestStepTitle('Given ', 'I do something good', 'Step')).toEqual('Given I do something good')
        })

        it('should determine a Undefined Step', () => {
            expect(getTestStepTitle('', '', 'Step')).toEqual('Undefined Step')
        })
    })

    it('getStepType', () => {
        expect(getStepType({} as any)).toBe('test')
        expect(getStepType({ hookId: '123' } as any)).toBe('hook')
    })

    it('getFeatureId', () => {
        expect(getFeatureId('/foo/bar.feature', {
            location: {
                line: 1,
                column: 2
            }
        } as any)).toBe('bar.feature:1:2')
    })

    it('buildStepPayload', () => {
        expect(buildStepPayload('uri', {
            name: 'some feature'
        } as any, {
            id: '321',
            tags: [{ name: 'some tag' }]
        } as any, {
            id: '123',
            text: 'title',
            keyword: 'Given'
        } as any, {
            type: 'step'
        })).toMatchSnapshot()
    })

    it('addKeywordToStep should add keywords to the steps', () => {
        const steps = [
            // Should get a keyword
            {
                text: 'I have a background',
                id: '20',
                astNodeIds: ['0']
            },
            // Should get a keyword
            {
                text: 'I have 42 cukes in my belly',
                id: '21',
                astNodeIds: ['2']
            },
            // Should NOT get a keyword
            {
                id: '77',
                hookId: '47'
            }
        ]
        const feature = {
            children: [
                {
                    background: {
                        keyword: 'Background',
                        name: '',
                        steps: [
                            {
                                keyword: 'Given ',
                                text: 'I have a background',
                                id: '0'
                            }
                        ],
                        id: '1'
                    }
                },
                {
                    scenario: {
                        keyword: 'Scenario',
                        name: 'cukes',
                        steps: [
                            {
                                keyword: 'Given ',
                                text: 'I have 42 cukes in my belly',
                                id: '2'
                            }
                        ],
                        id: '3'
                    }
                },
                {
                    rule: {
                        keyword: 'Rule',
                        name: 'Rule',
                        children: [
                            {
                                scenario: {
                                    keyword: 'Scenario Outline',
                                    name: 'rule outline',
                                    steps: [
                                        {
                                            keyword: 'Given ',
                                            text: 'I am on the login page',
                                            id: '4'
                                        }
                                    ],
                                    id: '5'
                                }
                            }
                        ],
                        id: '6'
                    }
                }
            ]
        }

        expect(addKeywordToStep(steps as any, feature as any)).toMatchSnapshot()
    })

    it('getRule should get the rule for an specific scenario id', () => {
        const feature = featureWithRules

        expect(getRule(feature as any, '1')).toBe(undefined)
        expect(getRule(feature as any, '2')).toBe('Rule for scenario 2')
        expect(getRule(feature as any, '3')).toBe('Rule for scenario 3 and 4')
        expect(getRule(feature as any, '4')).toBe('Rule for scenario 3 and 4')
    })

    it('generateSkipTagsFromCapabilities', () => {
        expect(generateSkipTagsFromCapabilities({
            browserName: 'chrome',
        }, [['@skip(browserName="chrome")']]))
            .toStrictEqual(['(not @skip\\(browserName="chrome"\\))'])

        expect(generateSkipTagsFromCapabilities({
            browserName: 'chrome',
        }, [['@skip\\(browserName="foobar"\\)']]))
            .toStrictEqual([])
    })

    expect(generateSkipTagsFromCapabilities({
        browserName: 'chrome',
        platformName: 'windows'
    }, [['@skip\\(browserName="foobar";platformName="windows"\\)']]))
        .toStrictEqual([])

    expect(generateSkipTagsFromCapabilities({
        browserName: 'chrome',
    }, [['@skip\\(something="weird"\\)']]))
        .toStrictEqual([])

    expect(generateSkipTagsFromCapabilities({
        browserName: 'chrome',
    }, [['@skip()']]))
        .toStrictEqual(['(not @skip\\(\\))'])

    expect(generateSkipTagsFromCapabilities({
        browserName: 'chrome',
    }, [['@skip']]))
        .toStrictEqual(['(not @skip)'])

    expect(generateSkipTagsFromCapabilities({
        browserName: 'chrome',
    }, [['@skip_local']]))
        .toStrictEqual([])

    describe('convertStatus', () => {
        it('maps Cucumber statuses to TestStatus', () => {
            expect(convertStatus(Status.PASSED)).toBe('pass')
            expect(convertStatus(Status.PENDING)).toBe('pending')
            expect(convertStatus(Status.SKIPPED)).toBe('skip')
            expect(convertStatus(Status.AMBIGUOUS)).toBe('skip')
            expect(convertStatus(Status.FAILED)).toBe('fail')
            expect(convertStatus(Status.UNDEFINED)).toBe('pass')
            expect(convertStatus(Status.UNKNOWN)).toBe('fail')
        })
    })
})
