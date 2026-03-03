import { useViewStore } from '@/stores/viewStore';
import { Box } from 'lucide-vue-next';

export const initTestPlugin = () => {
  const pluginStore = useViewStore();

  const pluginId = 'com.test.plugin-test';
  const viewId = `${pluginId}.main-view`;

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
