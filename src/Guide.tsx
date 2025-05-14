import React from 'react';

export const Guide: React.FC = () => (
  <div className="challenge-guide">
    <strong>How to complete the challenge:</strong><br />
    <ul style={{ textAlign: 'left', margin: '0.7em auto 0', paddingLeft: 22, color: 'var(--onyx-black)', fontSize: '0.98em' }}>
      <li>Start by focusing the <b>Start Keyboard Challenge</b> button and press <kbd>Enter</kbd> or <kbd>Space</kbd>.</li>
      <li>Use <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> to move between form fields and buttons.</li>
      <li>Use <kbd>Enter</kbd> or <kbd>Space</kbd> to activate buttons and submit the form.</li>
      <li>Use <kbd>Arrow</kbd> keys to adjust the slider.</li>
      <li>After submitting, focus will return to the start button so you can try again.</li>
      <li>No mouse required—keyboard only!</li>
    </ul>
  </div>
); 