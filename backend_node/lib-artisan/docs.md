```
./artisan sideMenu list --json_path=src/
components/side_menu.json

./artisan sideMenu add puppeteerx PuppeteerX test/puppeterrx 'fa fa-hand-right' --json_path=src/components/side_menu.json

./artisan sideMenu remove  puppeteerx --json_path=src/
components/side_menu.json


./artisan createModelEntity cms_user custom  --schema=src/api/data-source/config.json --out-model-dir=src/api/models --out-entity-dir=src/api/entities
```