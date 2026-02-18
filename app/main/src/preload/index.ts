import { contextBridge } from 'electron';
import * as Enums from '../shared/enums';
import { eventApi } from './api/event.api';
import { httpApi } from './api/http.api';
import { osApi } from './api/os.api';
import { pluginInfoApi } from './api/pluginInfo.api';
import { pluginSessionApi } from './api/pluginSession.api';
import { pluginStorageApi } from './api/pluginStorage.api';
import { scheduleApi } from './api/schedule.api';
import { settingsApi } from './api/settings.api';
import { tagApi } from './api/tag.api';
import { windowApi } from './api/window.api';
import { searchApi } from './api/search.api';

const croffleApi = {
  base: {
    windows: windowApi,
    tags: tagApi,
    schedules: scheduleApi,
    pluginInfo: pluginInfoApi,
    settings: settingsApi,
    search: searchApi,
  },
  app: {
    os: osApi,
    http: httpApi,
    storage: pluginStorageApi,
    event: eventApi,
    session: pluginSessionApi,
  },

  enums: Enums,
};

contextBridge.exposeInMainWorld('croffle', croffleApi);
