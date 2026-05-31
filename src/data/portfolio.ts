// @ts-nocheck
export const owner = {
  name: 'Ari Sulistiono',
  handle: '@ari.sulistiono',
  role: 'PRINCIPAL AUTOMATION ENGINEER',
  headline: "Hi, I'm Ari",
  subline:
    '20 years in substation automation — turning SCADA, IEC 61850, protocol testing, AI tools, and audio field experience into polished software products.',
  location: 'Indonesia',
  email: 'ari.sulistiono@gmail.com',
  initials: 'AS'
};

export const servicePills = ['Automation Tools', 'Protocol Testing', 'AI QC Suite', 'Audio Systems'];

export const projects = [
  {
    title: 'IEC 61850 RAW Analyzer',
    badge: 'Process Bus',
    description:
      'Sampled Values, GOOSE, PTP and SCL visibility for bench testing, FAT, and field troubleshooting — built around what engineers actually need to see.',
    status: 'In development',
    stack: ['React-style UX', 'WPF/.NET', 'RAW Ethernet', 'SCL Parser']
  },
  {
    title: 'QC NCR AI Suite',
    badge: 'Industrial AI',
    description:
      'Local NCR assistant with historical learning, recommendation engine, report writer, and management dashboard for panel factory quality workflows.',
    status: 'Product concept',
    stack: ['Ollama', 'SQLite', 'RAG', 'WPF/WinUI']
  },
  {
    title: 'IEC 104 / DNP3 Test Tools',
    badge: 'Protocol Forensic',
    description:
      'Testers that expose timing, command lifecycle, SOE behavior, polling weaknesses, redundancy symptoms, and evidence-grade test reports.',
    status: 'Engineering tools',
    stack: ['IEC 104', 'DNP3', 'Event Trace', 'PDF Evidence']
  },
  {
    title: 'SoundFitEQ',
    badge: 'Audio System',
    description:
      'Reference-zone based audio tuning assistant for speech, mosque sound, MC, meeting room, and practical live system EQ diagnosis.',
    status: 'PWA prototype',
    stack: ['React PWA', 'AudioWorklet', 'Spectrum', 'EQ Advisor']
  }
];

export const apps = {
  finder: {
    id: 'finder',
    title: 'Portfolio',
    short: 'Portfolio',
    color: 'linear-gradient(145deg,#dff8ff 0%,#68d4ff 45%,#1278ff 100%)',
    glyph: '⌘',
    defaultSize: { width: 920, height: 560 },
    defaultPosition: { x: 92, y: 104 }
  },
  systems: {
    id: 'systems',
    title: 'Systems',
    short: 'Systems',
    color: 'linear-gradient(145deg,#ff3b8d 0%,#7c3cff 52%,#03d8ff 100%)',
    glyph: '⚡',
    defaultSize: { width: 960, height: 570 },
    defaultPosition: { x: 140, y: 90 }
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    short: 'Terminal',
    color: 'linear-gradient(145deg,#1f232d 0%,#0a0d13 100%)',
    glyph: '›_',
    defaultSize: { width: 760, height: 460 },
    defaultPosition: { x: 175, y: 130 }
  },
  github: {
    id: 'github',
    title: 'GitHub',
    short: 'GitHub',
    color: 'linear-gradient(145deg,#ffffff 0%,#9aa4b6 100%)',
    glyph: 'GH',
    defaultSize: { width: 860, height: 520 },
    defaultPosition: { x: 165, y: 122 }
  },
  youtube: {
    id: 'youtube',
    title: 'YouTube',
    short: 'YouTube',
    color: 'linear-gradient(145deg,#ff4d4d 0%,#ff0000 64%,#9d0000 100%)',
    glyph: '▶',
    defaultSize: { width: 840, height: 520 },
    defaultPosition: { x: 150, y: 120 }
  },
  messages: {
    id: 'messages',
    title: 'Messages',
    short: 'Messages',
    color: 'linear-gradient(145deg,#e9ffe7 0%,#2ee85f 55%,#0a9c30 100%)',
    glyph: '✉',
    defaultSize: { width: 760, height: 560 },
    defaultPosition: { x: 175, y: 88 }
  },
  mail: {
    id: 'mail',
    title: 'Mail',
    short: 'Mail',
    color: 'linear-gradient(145deg,#ecfdff 0%,#5ec7ff 55%,#0b72d9 100%)',
    glyph: '✉',
    defaultSize: { width: 780, height: 520 },
    defaultPosition: { x: 182, y: 118 }
  },
  notes: {
    id: 'notes',
    title: 'Notes',
    short: 'Notes',
    color: 'linear-gradient(145deg,#fff7bf 0%,#ffd84d 44%,#f5a800 100%)',
    glyph: 'N',
    defaultSize: { width: 720, height: 520 },
    defaultPosition: { x: 210, y: 105 }
  }
};

export const dockOrder = ['finder', 'systems', 'terminal', 'messages', 'mail', 'youtube', 'github', 'notes'];
