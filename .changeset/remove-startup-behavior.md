---
'@croffledev/croffle-types': patch
---

Remove AppSettingStartupBehavior, general.startupBehavior, and SETTINGS_STARTUP_NAVIGATE.

Login presentation is now controlled only by startMinimized (and the
--croffle-start-hidden launch arg). Host settings no longer offer
last-session or calendar-home startup routing.
