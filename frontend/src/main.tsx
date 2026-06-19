import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Blocks,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  FileCode2,
  GitBranch,
  Globe2,
  LayoutDashboard,
  MonitorSmartphone,
  Play,
  Search,
  Settings2,
  Smartphone,
  Sparkles,
  TerminalSquare,
  Wand2,
} from 'lucide-react';
import './styles.css';

type Locale = 'en' | 'ko';
type Platform = 'web' | 'mobile' | 'both';
type TemplateId = 'smart-homecare' | 'starter-crm' | 'service-booking';

const copy = {
  en: {
    nav: ['Create', 'Templates', 'Generated Apps', 'Runs'],
    search: 'Search projects, templates, branches',
    title: 'Create an app from a proven template',
    subtitle: 'Developer-first for now. Clean enough for clients later.',
    create: 'Create App',
    template: 'Template',
    appName: 'App name',
    market: 'Market',
    language: 'Language',
    platform: 'Platform',
    provider: 'AI provider',
    generate: 'Generate App',
    preview: 'Preview',
    settings: 'Build Settings',
    branch: 'GitHub branch',
    source: 'Source templates',
    status: 'Run Status',
    workflow: 'Workflow',
    notes: 'Template Notes',
    englishFirst: 'English first',
    koreanReady: 'Korean ready',
    targetUsers: 'Target users',
    developers: 'Developers',
    publicLater: 'Public later',
    generatedShell: 'Generated app shell',
    webApp: 'Web app',
    mobileApp: 'Mobile app',
    both: 'Web + Mobile',
  },
  ko: {
    nav: ['생성', '템플릿', '생성된 앱', '실행'],
    search: '프로젝트, 템플릿, 브랜치 검색',
    title: '검증된 템플릿으로 앱 만들기',
    subtitle: '지금은 개발자용, 나중에는 고객에게도 깔끔하게.',
    create: '앱 생성',
    template: '템플릿',
    appName: '앱 이름',
    market: '시장',
    language: '언어',
    platform: '플랫폼',
    provider: 'AI 제공자',
    generate: '앱 생성',
    preview: '미리보기',
    settings: '빌드 설정',
    branch: 'GitHub 브랜치',
    source: '소스 템플릿',
    status: '실행 상태',
    workflow: '워크플로우',
    notes: '템플릿 노트',
    englishFirst: '영어 우선',
    koreanReady: '한국어 준비',
    targetUsers: '대상 사용자',
    developers: '개발자',
    publicLater: '대중 공개 예정',
    generatedShell: '생성 앱 셸',
    webApp: '웹 앱',
    mobileApp: '모바일 앱',
    both: '웹 + 모바일',
  },
};

const templates = [
  {
    id: 'smart-homecare' as const,
    name: 'Smart Homecare',
    label: 'Service booking',
    source: 'frontend-v1 + backend-v1',
    accent: 'green',
    score: 82,
    description: 'Reservation app, admin list, user settings, address flow.',
  },
  {
    id: 'starter-crm' as const,
    name: 'Starter CRM',
    label: 'Internal tool',
    source: 'planned',
    accent: 'blue',
    score: 64,
    description: 'Accounts, contacts, notes, pipeline, role-based views.',
  },
  {
    id: 'service-booking' as const,
    name: 'Service Booking Lite',
    label: 'Public service',
    source: 'planned',
    accent: 'slate',
    score: 58,
    description: 'Fast public form, status tracking, operator dashboard.',
  },
];

const steps = [
  { label: 'Read template source', state: 'done' },
  { label: 'Extract screens and API map', state: 'active' },
  { label: 'Generate clean project', state: 'queued' },
  { label: 'Open preview', state: 'queued' },
];

function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('smart-homecare');
  const [platform, setPlatform] = useState<Platform>('both');
  const [appName, setAppName] = useState('App Now Demo');
  const [market, setMarket] = useState('Korea + Global');
  const [englishFirst, setEnglishFirst] = useState(true);
  const [koreanReady, setKoreanReady] = useState(true);
  const t = copy[locale];

  const template = useMemo(
    () => templates.find((item) => item.id === selectedTemplate) ?? templates[0],
    [selectedTemplate],
  );

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand-lockup">
          <div className="brand-mark">AN</div>
          <div>
            <div className="brand-name">App Now</div>
            <div className="brand-caption">Builder Console</div>
          </div>
        </div>

        <nav className="nav-list">
          {t.nav.map((item, index) => {
            const icons = [Wand2, Blocks, FileCode2, TerminalSquare];
            const Icon = icons[index];
            return (
              <button className={index === 0 ? 'nav-item active' : 'nav-item'} key={item}>
                <Icon size={18} />
                <span>{item}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sync-pill">
            <GitBranch size={16} />
            <span>asus/frontend-shell</span>
          </div>
          <div className="mini-copy">Frontend lane. Backend lane stays open for Mac.</div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <label className="searchbox">
            <Search size={17} />
            <input aria-label={t.search} placeholder={t.search} />
          </label>
          <div className="topbar-actions">
            <div className="segmented" role="group" aria-label="Language">
              <button className={locale === 'en' ? 'selected' : ''} onClick={() => setLocale('en')}>EN</button>
              <button className={locale === 'ko' ? 'selected' : ''} onClick={() => setLocale('ko')}>KR</button>
            </div>
            <button className="ghost-button">
              <ExternalLink size={17} />
              <span>GitHub</span>
            </button>
            <button className="primary-button">
              <Play size={17} />
              <span>{t.generate}</span>
            </button>
          </div>
        </header>

        <div className="content-grid">
          <section className="main-column">
            <div className="intro-band">
              <div>
                <p className="eyebrow">APP NOW V1</p>
                <h1>{t.title}</h1>
                <p>{t.subtitle}</p>
              </div>
              <div className="run-health">
                <CheckCircle2 size={19} />
                <span>Template core connected</span>
              </div>
            </div>

            <section className="panel create-panel" aria-labelledby="create-heading">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">{t.create}</p>
                  <h2 id="create-heading">{appName}</h2>
                </div>
                <div className="mode-chip">
                  <MonitorSmartphone size={16} />
                  <span>{platform === 'both' ? t.both : platform === 'web' ? t.webApp : t.mobileApp}</span>
                </div>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>{t.appName}</span>
                  <input value={appName} onChange={(event) => setAppName(event.target.value)} />
                </label>
                <label className="field">
                  <span>{t.market}</span>
                  <input value={market} onChange={(event) => setMarket(event.target.value)} />
                </label>
                <label className="field">
                  <span>{t.provider}</span>
                  <select defaultValue="openai">
                    <option value="openai">OpenAI</option>
                    <option value="later">Provider slot later</option>
                  </select>
                </label>
                <div className="field">
                  <span>{t.platform}</span>
                  <div className="segmented wide" role="group" aria-label={t.platform}>
                    <button className={platform === 'web' ? 'selected' : ''} onClick={() => setPlatform('web')}>
                      <Globe2 size={15} />
                      Web
                    </button>
                    <button className={platform === 'mobile' ? 'selected' : ''} onClick={() => setPlatform('mobile')}>
                      <Smartphone size={15} />
                      Mobile
                    </button>
                    <button className={platform === 'both' ? 'selected' : ''} onClick={() => setPlatform('both')}>
                      <MonitorSmartphone size={15} />
                      Both
                    </button>
                  </div>
                </div>
              </div>

              <div className="switch-row">
                <label className="switch">
                  <input type="checkbox" checked={englishFirst} onChange={() => setEnglishFirst((value) => !value)} />
                  <span />
                  {t.englishFirst}
                </label>
                <label className="switch">
                  <input type="checkbox" checked={koreanReady} onChange={() => setKoreanReady((value) => !value)} />
                  <span />
                  {t.koreanReady}
                </label>
              </div>
            </section>

            <section className="panel" aria-labelledby="template-heading">
              <div className="panel-heading compact">
                <div>
                  <p className="eyebrow">{t.template}</p>
                  <h2 id="template-heading">Template Library</h2>
                </div>
                <button className="text-button">
                  View all
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="template-grid">
                {templates.map((item) => (
                  <button
                    key={item.id}
                    className={item.id === selectedTemplate ? `template-tile selected ${item.accent}` : `template-tile ${item.accent}`}
                    onClick={() => setSelectedTemplate(item.id)}
                  >
                    <span className="template-topline">
                      <span>{item.label}</span>
                      <span>{item.score}%</span>
                    </span>
                    <strong>{item.name}</strong>
                    <span>{item.description}</span>
                    <span className="template-source">{item.source}</span>
                  </button>
                ))}
              </div>
            </section>
          </section>

          <aside className="right-column">
            <section className="panel preview-panel" aria-labelledby="preview-heading">
              <div className="panel-heading compact">
                <div>
                  <p className="eyebrow">{t.preview}</p>
                  <h2 id="preview-heading">{t.generatedShell}</h2>
                </div>
                <LayoutDashboard size={18} />
              </div>
              <div className="device-preview">
                <div className="preview-top">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="preview-body">
                  <div className="preview-sidebar" />
                  <div className="preview-content">
                    <div className="preview-line strong" />
                    <div className="preview-row">
                      <div />
                      <div />
                    </div>
                    <div className="preview-table">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel" aria-labelledby="settings-heading">
              <div className="panel-heading compact">
                <div>
                  <p className="eyebrow">{t.settings}</p>
                  <h2 id="settings-heading">{template.name}</h2>
                </div>
                <Settings2 size={18} />
              </div>
              <dl className="meta-list">
                <div>
                  <dt>{t.branch}</dt>
                  <dd>codex/asus-frontend-appnow-shell</dd>
                </div>
                <div>
                  <dt>{t.source}</dt>
                  <dd>{template.source}</dd>
                </div>
                <div>
                  <dt>{t.targetUsers}</dt>
                  <dd>{t.developers} → {t.publicLater}</dd>
                </div>
              </dl>
            </section>

            <section className="panel" aria-labelledby="workflow-heading">
              <div className="panel-heading compact">
                <div>
                  <p className="eyebrow">{t.workflow}</p>
                  <h2 id="workflow-heading">{t.status}</h2>
                </div>
                <Sparkles size={18} />
              </div>
              <ol className="step-list">
                {steps.map((step) => (
                  <li key={step.label} className={step.state}>
                    <span />
                    <p>{step.label}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="note-panel">
              <Code2 size={18} />
              <p>{t.notes}: SHC is useful as source material, not as the visual design model.</p>
              <Database size={18} />
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
