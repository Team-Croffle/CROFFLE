import { useViewStore } from '@/stores/viewStore';
import { Box } from 'lucide-vue-next';
import type { PluginInfo } from 'croffle';

const pluginId = 'com.test.dummy';
const viewId = `${pluginId}.main-view1`;

export const initTestPlugin = () => {
  const pluginStore = useViewStore();

  pluginStore.registerMenu({
    title: '테스트 플러그인',
    subtitle: 'test',
    icon: Box,
    id: viewId,
  });

  pluginStore.registerView(viewId, (container: HTMLElement) => {
    // Vue 시스템 밖에서 순수 JS로 화면을 그립니다. React라면 root.render()를 호출합니다.
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-family: sans-serif;">
        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: #4F46E5;">
          🚀 외부 플러그인 화면입니다!
        </h1>
        <p style="color: #6b7280; margin-bottom: 2rem;">
          이 화면은 Vue 내부가 아닌, 플러그인 스크립트가 직접 DOM을 조작하여 생성한 화면입니다.
        </p>
        <button id="plugin-btn" style="padding: 0.75rem 1.5rem; background-color: #4F46E5; color: white; border-radius: 0.5rem; border: none; cursor: pointer; transition: background 0.2s;">
          플러그인 버튼 클릭
        </button>
      </div>
    `;

    // 이벤트 리스너 바인딩
    const btn = container.querySelector('#plugin-btn');
    btn?.addEventListener('click', () => {
      croffle.app.os.showNotification(
        '플러그인 버튼이 클릭되었습니다!',
        '이 이벤트는 순수 JS로 작동합니다.'
      );
    });
  });
};

export const mockPluginsList: PluginInfo[] = [
  {
    id: pluginId,
    name: 'My Dummy Plugin',
    enabled: true,
    version: 'v1.0.0',
    author: 'BlueNyang',
    description: 'test plugin',
    features: {
      views: [
        {
          id: viewId,
          title: '더미 플러그인',
          subtitle: '테스트용',
          icon: 'icon',
        },
      ],
      contextMenus: [],
    },
  },
];

export const testMockPlugin = () => {
  setTimeout(() => {
    console.log('[Test Plugin] 가짜 등록 이벤트 발송 준비 완료');

    window.dispatchEvent(
      new CustomEvent('plugin:register-view', {
        detail: {
          pluginId: pluginId,
          viewId: viewId,
          renderFn: (container: HTMLElement) => {
            container.innerHTML = `
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-family: sans-serif;">
                <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem; color: #4F46E5;">
                  가짜 플러그인이 로드되었습니다!
                </h1>
                <p>뷰 ID: com.test.dummy.view1</p>
                <button id="plugin-btn">
                  플러그인 버튼 액션
                </button>
              </div>
            `;

            const btn = container.querySelector('#plugin-btn');
            btn?.addEventListener('click', () => {
              croffle.app.os.showNotification(
                '플러그인 버튼이 클릭되었습니다!',
                '이 이벤트는 순수 JS로 작동합니다.'
              );
            });
          },
        },
      })
    );
  }, 2000);
};
