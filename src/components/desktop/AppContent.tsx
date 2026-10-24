// @ts-nocheck
import React, { useMemo, useState } from 'react';

function ProjectGrid({ projects }) {
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <article className="project-card" key={project.title}>
          <div className="card-topline">
            <span>{project.badge}</span>
            <em>{project.status}</em>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="stack-row">
            {project.stack.map((item) => <span key={item}>{item}</span>)}
          </div>
          {project.releaseUrl && (
            <div className="project-links">
              <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">Product page ↗</a>
              <a href={project.releaseUrl} target="_blank" rel="noopener noreferrer">Download M3.H ↗</a>
              <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">Source ↗</a>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function PortfolioApp({ projects, owner, openApp }) {
  return (
    <div className="app-page portfolio-app">
      <aside className="finder-sidebar">
        <div className="profile-chip">
          <div className="avatar">{owner.initials}</div>
          <div>
            <strong>{owner.name}</strong>
            <span>{owner.handle}</span>
          </div>
        </div>
        {['Portfolio', 'Protocol Tools', 'AI Projects', 'Audio Systems', 'Documents'].map((item, index) => (
          <button className={index === 0 ? 'is-selected' : ''} key={item}>{item}</button>
        ))}
      </aside>
      <section className="finder-main">
        <div className="section-head">
          <span>Author Portfolio</span>
          <h2>Field-tested engineering, presented like a product.</h2>
          <p>Clean software demos for substation automation, FAT, protocol diagnostics, QC workflows, and audio system review.</p>
        </div>
        <ProjectGrid projects={projects} />
        <div className="quick-actions">
          <button onClick={() => openApp('systems')}>Open Systems</button>
          <button onClick={() => openApp('github')}>View Repositories</button>
          <button onClick={() => openApp('messages')}>Message Ari</button>
        </div>
      </section>
    </div>
  );
}

function SystemsApp({ projects }) {
  return (
    <div className="app-page systems-app">
      <div className="systems-hero">
        <span>Industrial Software Architecture</span>
        <h2>Not a generic portfolio. A practical engineering desktop.</h2>
        <p>Every app represents a workbench: diagnose, inspect, explain, report, and make technical workflows easier to trust.</p>
      </div>
      <div className="systems-map">
        {projects.map((project, index) => (
          <div className="system-node" key={project.title}>
            <div className="node-index">0{index + 1}</div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TerminalApp({ owner }) {
  const [lines, setLines] = useState([
    'AriOS Terminal v5.0',
    'Type: help, skills, projects, contact',
    ''
  ]);
  const [value, setValue] = useState('');

  const runCommand = (event) => {
    event.preventDefault();
    const command = value.trim().toLowerCase();
    const output = [];
    if (!command) return;
    output.push(`ari@portfolio ~ % ${value}`);
    if (command === 'help') output.push('Available: skills, projects, contact, clear');
    else if (command === 'skills') output.push('SCADA, IEC 61850, GOOSE, SV, DNP3, IEC 104, Modbus, WPF, React, AI tooling, audio system tuning.');
    else if (command === 'projects') output.push('ARStack Process Bus Simulator M3.H [PUBLIC] | IEC 61850 RAW Analyzer | QC NCR AI Suite | DNP3/IEC104 Tools | SoundFitEQ');
    else if (command === 'contact') output.push(`${owner.email}`);
    else if (command === 'clear') {
      setLines([]);
      setValue('');
      return;
    } else output.push(`Command not found: ${command}`);
    setLines((current) => [...current, ...output, '']);
    setValue('');
  };

  return (
    <div className="terminal-page">
      <div className="terminal-lines">
        {lines.map((line, index) => <div key={`${line}-${index}`}>{line || '\u00A0'}</div>)}
      </div>
      <form onSubmit={runCommand} className="terminal-input-row">
        <span>ari@portfolio ~ %</span>
        <input value={value} onChange={(event) => setValue(event.target.value)} autoFocus spellCheck="false" />
      </form>
    </div>
  );
}

function GithubApp({ projects }) {
  return (
    <div className="app-page github-app">
      <div className="github-header">
        <div className="github-avatar">AS</div>
        <div>
          <h2>ari.sulistiono</h2>
          <p>Industrial automation tools, protocol diagnostics, HMI experiments, and audio software prototypes.</p>
        </div>
      </div>
      <div className="repo-list">
        {projects.map((project) => (
          <article className="repo-row" key={project.title}>
            <div>
              <h3>{project.title.replaceAll(' ', '-').toLowerCase()}</h3>
              <p>{project.description}</p>
              {project.releaseUrl && <a href={project.releaseUrl} target="_blank" rel="noopener noreferrer" className="repo-release">Official M3.H release ↗</a>}
            </div>
            <span>{project.badge}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function YoutubeApp() {
  return (
    <div className="youtube-page">
      <div className="youtube-card">
        <div className="play-button">▶</div>
        <h2>SonKuPik / Tutorial Mas Ari</h2>
        <p>Audio system review, field tuning, practical engineering content, and product walkthroughs with calm, useful explanations.</p>
        <button>Open Channel ↗</button>
      </div>
    </div>
  );
}

function MessagesApp({ owner }) {
  return (
    <div className="messages-page">
      <div className="message-profile">
        <div className="message-avatar">AS</div>
        <div><strong>{owner.name}</strong><span>Online</span></div>
      </div>
      <div className="chat-area">
        <div className="bubble incoming">Assalamu’alaikum. I’m Ari’s assistant. What project do you want to discuss?</div>
        <div className="bubble incoming small">Choose: automation, AI tool, audio, or portfolio collaboration.</div>
      </div>
      <div className="chat-input"><span>Your message...</span><button>➤</button></div>
    </div>
  );
}

function MailApp({ owner }) {
  return (
    <div className="mail-page">
      <aside className="mail-sidebar">
        <button className="compose">Compose</button>
        <span>Inbox</span><span>Projects</span><span>Collaboration</span><span>Archive</span>
      </aside>
      <section className="mail-compose">
        <label>To</label>
        <div className="mail-field">{owner.email}</div>
        <label>Subject</label>
        <div className="mail-field">Project discussion / collaboration</div>
        <label>Message</label>
        <textarea defaultValue={'Hi Ari,\n\nI would like to discuss...'} />
      </section>
    </div>
  );
}

function NotesApp({ projects }) {
  const notes = useMemo(() => [
    'Keep every tool field-based: expose real failure modes, not textbook features.',
    'UI must feel premium: calm hierarchy, readable contrast, controlled motion.',
    'Every prototype should be easy to explain, easy to test, and easy to deploy.',
    'Next step: convert the strongest tools into public portfolio demos.'
  ], []);
  return (
    <div className="notes-page">
      <div className="notes-paper">
        <h2>Product notes</h2>
        {notes.map((note) => <p key={note}>• {note}</p>)}
        <hr />
        <strong>Current focus</strong>
        <p>{projects[0].title} — make diagnostics visible enough that engineers trust the tool within the first minute.</p>
      </div>
    </div>
  );
}

export function AppContent({ appId, openApp, projects, owner }) {
  if (appId === 'finder') return <PortfolioApp projects={projects} owner={owner} openApp={openApp} />;
  if (appId === 'systems') return <SystemsApp projects={projects} />;
  if (appId === 'terminal') return <TerminalApp owner={owner} />;
  if (appId === 'github') return <GithubApp projects={projects} />;
  if (appId === 'youtube') return <YoutubeApp />;
  if (appId === 'messages') return <MessagesApp owner={owner} />;
  if (appId === 'mail') return <MailApp owner={owner} />;
  if (appId === 'notes') return <NotesApp projects={projects} />;
  return null;
}
