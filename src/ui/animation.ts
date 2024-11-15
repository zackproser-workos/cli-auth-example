import blessed from 'blessed';

const screen = blessed.screen({
  smartCSR: true
});

const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Starting OAuth flow...',
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: '#f0f0f0'
    }
  }
});

screen.append(box);

export function updateAuthStatus(message: string): void {
  box.setContent(message);
  screen.render();
}

export function closeAnimation(): void {
  screen.destroy();
} 