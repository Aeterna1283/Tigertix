import '@testing-library/jest-dom';

// Suppress React act() warnings globally
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('An update to')) {
      return;
    }
    if (typeof args[0] === 'string' && args[0].includes('inside a test was not wrapped in act')) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Mock axios globally
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock scrollIntoView to prevent errors in tests
HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock SpeechRecognition
class MockSpeechRecognition {
  constructor() {
    this.continuous = false;
    this.interimResults = false;
    this.lang = 'en-US';
    this.onresult = null;
    this.onerror = null;
    this.onend = null;
    MockSpeechRecognition.instance = this;
  }
  start() {
    setTimeout(() => {
      this.onresult?.({
        results: [[{ transcript: 'Book 2 tickets' }]],
      });
    }, 50);
  }
  stop() {
    this.onend?.();
  }
}

global.SpeechRecognition = MockSpeechRecognition;
global.webkitSpeechRecognition = MockSpeechRecognition;

// Mock speechSynthesis
class MockSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
    this.lang = 'en-US';
  }
}
global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
global.speechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});