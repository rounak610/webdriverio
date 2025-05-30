---
id: protocols
title: Protocol Commands
---

WebdriverIO یک فریمورک اتوماسیون است که برای کنترل یک remote agent، به عنوان مثال برای یک مرورگر، دستگاه تلفن همراه یا تلویزیون، بر پروتکل‌های مختلف اتوماسیون متکی است. بر اساس دستگاه ریموت، پروتکل های مختلفی وارد بازی می شوند. این دستورها بسته به اطلاعات session توسط سرور remote (مثلاً درایور مرورگر) به شیء [Browser](/docs/api/browser) یا [Element](/docs/api/element) اختصاص داده می شوند.

در داخل WebdriverIO تقریباً برای تمام تعاملات با عامل راه دور از دستورات پروتکل استفاده می شود. با این حال دستورات اضافی اختصاص داده شده به [Browser](/docs/api/browser) یا [Element](/docs/api/element) Object استفاده از WebdriverIO را ساده می کند، به عنوان مثال دریافت متن یک element با استفاده از دستورات پروتکل به شکل زیر است:

```js
const searchInput = await browser.findElement('css selector', '#lst-ib')
await client.getElementText(searchInput['element-6066-11e4-a52e-4f735466cecf'])
```

با استفاده از دستورات راحت [Browser](/docs/api/browser) یا [Element](/docs/api/element) Object می توان دستورات را به مورد زیر کاهش داد:

```js
$('#lst-ib').getText()
```

در ادامه هر پروتکل جداگانه توضیح داده می‌شود.

## پروتکل WebDriver

پروتکل [WebDriver](https://w3c.github.io/webdriver/#elements) یک استاندارد وب برای خودکارسازی مرورگر است. این استاندارد، برخلاف برخی دیگر از ابزارهای E2E، تضمین می کند که اتوماسیون را می توان در مرورگر واقعی که توسط کاربران شما استفاده می شود، به عنوان مثال فایرفاکس، سافاری و کروم و مرورگر مبتنی بر Chromium مانند Edge، و نه تنها در موتورهای مرورگر، بلکه به عنوان مثال WebKit، که بسیار متفاوت هستند، انجام داد.

مزیت استفاده از پروتکل WebDriver در مقابل پروتکل‌های اشکال زدایی مانند [Chrome DevTools](https://w3c.github.io/webdriver/#elements) این است که شما مجموعه‌ای از دستورات دارید که اجازه می‌دهد با مرورگر به طور یکسان در تمام مرورگرها تعامل داشته باشید که احتمال ناپایداری تست ها را کاهش می‌دهد. Furthermore offers this protocol abilities for massive scalability by using cloud vendors such as [Sauce Labs](https://saucelabs.com/), [BrowserStack](https://www.browserstack.com/) and [others](https://github.com/christian-bromann/awesome-selenium#cloud-services).

## پروتکل WebDriver Bidi

پروتکل [WebDriver Bidi](https://w3c.github.io/webdriver-bidi/) نسل دوم این پروتکل است و در حال حاضر توسط اکثر سازندگان مرورگر بر روی آن کار می شود. این پروتکل در مقایسه با نسخه قبلی خود از یک ارتباط دو جهته (به همین دلیل "Bidi") بین فریمورک و دستگاه remote پشتیبانی می کند. علاوه بر این، این پروتکل موارد پایه ای دیگری را برای درون نگری بهتر مرورگر و برای خودکارسازی بهتر برنامه های تحت وب در مرورگر معرفی می کند.

با توجه به اینکه این پروتکل در حال حاضر در حال ساخت است، ویژگی های بیشتری به مرور زمان اضافه می شود و توسط مرورگر پشتیبانی خواهد شد. اگر از دستورات راحت WebdriverIO استفاده کنید، هیچ چیز برای شما تغییر نخواهد کرد. WebdriverIO از قابلیت‌های پروتکل جدید به محض اینکه در مرورگر موجود و پشتیبانی شوند، استفاده خواهد کرد.

## Appium

پروژه [Appium](https://appium.io/) قابلیت هایی را برای خودکارسازی موبایل، دسکتاپ و سایر انواع دستگاه های IoT فراهم می کند. در حالی که WebDriver بر مرورگر و وب تمرکز می کند، چشم انداز Appium استفاده از همان رویکرد اما برای هر دستگاه دلخواه است. این پروتکل، علاوه بر دستوراتی که WebDriver تعریف می کند، دستورات خاصی دارد که اغلب مختص دستگاه remote است که در حال خودکار شدن است. این پروتکل برای سناریوهای تست تلفن همراه، زمانی که می خواهید تست های مشابهی را برای برنامه های اندروید و iOS بنویسید و اجرا کنید، ایده آل است.

According to Appium [documentation](https://appium.github.io/appium.io/docs/en/about-appium/intro/?lang=en) it was designed to meet mobile automation needs according to a philosophy outlined by the following four tenets:

- برای خودکارسازی آن، مجبور نیستید برنامه خود را دوباره کامپایل کنید یا به هیچ وجه آن را تغییر دهید.
- برای نوشتن و اجرای تست‌های خود نباید به زبان یا فریمورک خاصی مجبور شوید.
- یک فریمورک اتوماسیون تلفن همراه نباید چرخ را دوباره اختراع کند وقتی صحبت از APIهای اتوماسیون می شود.
- یک فریمورک اتوماسیون موبایل باید از نظر روحی و عملی و همچنین از نظر شفاهی منبع باز باشد!

## Chromium

The Chromium protocol offers a super set of commands on top of the WebDriver protocol that is only supported when running automated session through [Chromedriver](https://chromedriver.chromium.org/chromedriver-canary) or [Edgedriver](https://developer.microsoft.com/fr-fr/microsoft-edge/tools/webdriver).

## Firefox

پروتکل Chromium مجموعه‌ای فوق‌العاده از دستورات را در بالای پروتکل WebDriver ارائه می‌کند که فقط هنگام اجرای session خودکار از طریق [Chromedriver](https://github.com/mozilla/geckodriver)پشتیبانی می‌شود.

## Sauce Labs

پروتکل [Sauce Labs](https://saucelabs.com/) مجموعه‌ای فوق‌العاده از دستورات را در بالای پروتکل WebDriver ارائه می‌دهد که فقط در هنگام اجرای جلسه خودکار با استفاده از ابر Sauce Labs پشتیبانی می‌شود.

## Selenium Standalone

پروتکل [Selenium Standalone](https://www.selenium.dev/documentation/grid/advanced_features/endpoints/) مجموعه‌ای فوق‌العاده از دستورات را در بالای پروتکل WebDriver ارائه می‌دهد که فقط در هنگام اجرای جلسه خودکار با استفاده از ابر Selenium Grid پشتیبانی می‌شود.

## JSON Wire Protocol

[JSON Wire Protocol](https://www.selenium.dev/documentation/legacy/json_wire_protocol/) نسخه پیشین پروتکل WebDriver است و __امروز__ منسوخ شده است. در حالی که ممکن است برخی از دستورات هنوز در محیط های خاصی پشتیبانی شوند، استفاده از هیچ یک از دستورات آن توصیه نمی شود.

## Mobile JSON Wire Protocol

[Mobile JSON Wire Protocol](https://github.com/SeleniumHQ/mobile-spec/blob/master/spec-draft.md) مجموعه ای فوق العاده از دستورات تلفن همراه در بالای پروتکل JSON Wire است. با توجه به این که این پروتکل منسوخ شده است، پروتکل JSON Wire Mobile نیز __منسوخ شده است__. Appium ممکن است هنوز از برخی از دستورات خود پشتیبانی کند، اما استفاده از آنها توصیه نمی شود.
