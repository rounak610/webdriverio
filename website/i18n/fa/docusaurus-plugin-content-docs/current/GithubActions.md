---
id: githubactions
title: Github Actions
---

If your repository is hosted on Github, you can use [Github Actions](https://docs.github.com/en/actions) to run your tests on Github's infrastructure.

1. every time you push changes
2. در هر ایجاد درخواست pull
3. در زمان مقرر
4. توسط یک ماشه دستی

در ریشه مخزن خود، یک دایرکتوری `.github/workflows` ایجاد کنید. یک فایل Yaml اضافه کنید، برای مثال `/workflows/ci.yaml`. در آنجا نحوه اجرای تست های خود را پیکربندی خواهید کرد.

برای اجرای مرجع به [jasmine-boilerplate](https://github.com/webdriverio/jasmine-boilerplate/blob/master/.github/workflows/ci.yaml) و [اجرا های تست نمونه](https://github.com/webdriverio/jasmine-boilerplate/actions?query=workflow%3ACI) مراجعه کنید.

```yaml reference
https://github.com/webdriverio/jasmine-boilerplate/blob/master/.github/workflows/ci.yaml
```

Find out in the [Github Docs](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-workflow-runs/manually-running-a-workflow?tool=cli) on more information about creating workflow files.
