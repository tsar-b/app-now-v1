import React, { useEffect, useMemo, useState } from 'react';
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
  KeyRound,
  LayoutDashboard,
  Loader2,
  MonitorSmartphone,
  Play,
  Search,
  Send,
  Server,
  Settings2,
  Smartphone,
  Sparkles,
  TerminalSquare,
  Wand2,
} from 'lucide-react';
import {
  API_BASE_URL,
  checkHealth,
  createBooking,
  loadCatalog,
  login,
  type ApiError,
  type CatalogResponse,
} from './api';
import './styles.css';

type Locale = 'en' | 'ko';
type Platform = 'web' | 'mobile' | 'both';
type TemplateId = 'smart-homecare' | 'starter-crm' | 'service-booking';
type RequestState = 'idle' | 'loading' | 'success' | 'error';

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
    generate: 'Probe Backend',
    submitDraft: 'Send Draft',
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
    backend: 'Backend',
    backendOnline: 'Backend online',
    backendOffline: 'Backend offline',
    catalog: 'Catalog',
    catalogLoaded: 'Catalog loaded',
    login: 'Login',
    authToken: 'Auth token',
    email: 'Email',
    password: 'Password',
    draft: 'Draft Request',
    apiBase: 'API base',
  },
  ko: {
    nav: ['생성', '템플릿', '생성 앱', '실행'],
    search: '프로젝트, 템플릿, 브랜치 검색',
    title: '검증된 템플릿으로 앱 만들기',
    subtitle: '지금은 개발자용. 나중에는 고객에게도 깔끔하게.',
    create: '앱 생성',
    template: '템플릿',
    appName: '앱 이름',
    market: '시장',
    language: '언어',
    platform: '플랫폼',
    provider: 'AI 제공자',
    generate: '백엔드 확인',
    submitDraft: '초안 전송',
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
    backend: '백엔드',
    backendOnline: '백엔드 연결됨',
    backendOffline: '백엔드 연결 안 됨',
    catalog: '카탈로그',
    catalogLoaded: '카탈로그 로드됨',
    login: '로그인',
    authToken: '인증 토큰',
    email: '이메일',
    password: '비밀번호',
    draft: '요청 초안',
    apiBase: 'API 주소',
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

function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('smart-homecare');
  const [platform, setPlatform] = useState<Platform>('both');
  const [appName, setAppName] = useState('App Now Demo');
  const [market, setMarket] = useState('Korea + Global');
  const [englishFirst, setEnglishFirst] = useState(true);
  const [koreanReady, setKoreanReady] = useState(true);
  const [healthState, setHealthState] = useState<RequestState>('idle');
  const [catalogState, setCatalogState] = useState<RequestState>('idle');
  const [draftState, setDraftState] = useState<RequestState>('idle');
  const [authState, setAuthState] = useState<RequestState>('idle');
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [authToken, setAuthToken] = useState('');
  const [email, setEmail] = useState('admin@appnow.local');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('Waiting for backend connection.');
  const t = copy[locale];

  const template = useMemo(
    () => templates.find((item) => item.id === selectedTemplate) ?? templates[0],
    [selectedTemplate],
  );

  const languageMode = englishFirst && koreanReady ? 'en-first-ko-ready' : englishFirst ? 'en-only' : 'ko-first';

  useEffect(() => {
    void handleHealthCheck(false);
  }, []);

  async function handleHealthCheck(showSuccess = true) {
    setHealthState('loading');
    try {
      await checkHealth();
      setHealthState('success');
      if (showSuccess) setStatusMessage('Backend /health is responding.');
    } catch (error) {
      setHealthState('error');
      setStatusMessage(formatApiError(error, 'Backend is not reachable yet.'));
    }
  }

  async function handleCatalogLoad() {
    setCatalogState('loading');
    try {
      const nextCatalog = await loadCatalog();
      setCatalog(nextCatalog);
      setCatalogState('success');
      setStatusMessage('Catalog endpoint loaded from the backend template.');
    } catch (error) {
      setCatalogState('error');
      setStatusMessage(formatApiError(error, 'Catalog endpoint failed.'));
    }
  }

  async function handleLogin() {
    setAuthState('loading');
    try {
      const response = await login(email, password);
      setAuthToken(response.token);
      setAuthState('success');
      setStatusMessage('Login succeeded. Token is ready for booking requests.');
    } catch (error) {
      setAuthState('error');
      setStatusMessage(formatApiError(error, 'Login failed.'));
    }
  }

  async function handleDraftSubmit() {
    if (!authToken.trim()) {
      setDraftState('error');
      setStatusMessage('Paste a JWT or login before sending a booking draft.');
      return;
    }

    setDraftState('loading');
    try {
      await createBooking(
        {
          app_name: appName,
          template_id: selectedTemplate,
          market,
          platform,
          language_mode: languageMode,
          source: template.source,
          status: 'pending',
        },
        authToken.trim(),
      );
      setDraftState('success');
      setStatusMessage('Draft request reached /api/bookings.');
    } catch (error) {
      setDraftState('error');
      setStatusMessage(formatApiError(error, 'Draft request failed.'));
    }
  }

  const catalogCount = catalog
    ? catalog.subtypes.length +
      catalog.options.length +
      catalog.pricings.length +
      catalog.assets.length +
      catalog.timeSlots.length +
      catalog.serviceTypes.length
    : 0;

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
              <button className={locale === 'en' ? 'selected' : ''} onClick={() => setLocale('en')}>
                EN
              </button>
              <button className={locale === 'ko' ? 'selected' : ''} onClick={() => setLocale('ko')}>
                KR
              </button>
            </div>
            <button className="ghost-button" onClick={() => window.open('https://github.com/tsar-b/app-now-v1', '_blank')}>
              <ExternalLink size={17} />
              <span>GitHub</span>
            </button>
            <button className="primary-button" onClick={() => handleHealthCheck()}>
              {healthState === 'loading' ? <Loader2 className="spin" size={17} /> : <Server size={17} />}
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
              <div className={healthState === 'success' ? 'run-health' : 'run-health muted'}>
                <CheckCircle2 size={19} />
                <span>{healthState === 'success' ? t.backendOnline : t.backendOffline}</span>
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
                    className={
                      item.id === selectedTemplate
                        ? `template-tile selected ${item.accent}`
                        : `template-tile ${item.accent}`
                    }
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

            <section className="panel integration-panel" aria-labelledby="backend-heading">
              <div className="panel-heading compact">
                <div>
                  <p className="eyebrow">{t.backend}</p>
                  <h2 id="backend-heading">Supabase Core Template</h2>
                </div>
                <Server size={18} />
              </div>

              <div className="backend-grid">
                <div className="connection-card">
                  <span>{t.apiBase}</span>
                  <strong>{API_BASE_URL}</strong>
                  <button className="secondary-button" onClick={handleCatalogLoad}>
                    {catalogState === 'loading' ? <Loader2 className="spin" size={16} /> : <Database size={16} />}
                    {t.catalog}
                  </button>
                </div>
                <div className="connection-card">
                  <span>{t.catalogLoaded}</span>
                  <strong>{catalogCount} records</strong>
                  <p>subtypes, options, pricings, assets, time slots, service types</p>
                </div>
                <div className="connection-card wide-card">
                  <span>Latest API message</span>
                  <strong>{statusMessage}</strong>
                </div>
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

            <section className="panel" aria-labelledby="auth-heading">
              <div className="panel-heading compact">
                <div>
                  <p className="eyebrow">{t.login}</p>
                  <h2 id="auth-heading">{t.authToken}</h2>
                </div>
                <KeyRound size={18} />
              </div>
              <div className="stacked-fields">
                <label className="field">
                  <span>{t.email}</span>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} />
                </label>
                <label className="field">
                  <span>{t.password}</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Backend test password"
                  />
                </label>
                <button className="secondary-button full-width" onClick={handleLogin}>
                  {authState === 'loading' ? <Loader2 className="spin" size={16} /> : <KeyRound size={16} />}
                  {t.login}
                </button>
                <label className="field">
                  <span>{t.authToken}</span>
                  <textarea value={authToken} onChange={(event) => setAuthToken(event.target.value)} />
                </label>
              </div>
            </section>

            <section className="panel" aria-labelledby="draft-heading">
              <div className="panel-heading compact">
                <div>
                  <p className="eyebrow">{t.draft}</p>
                  <h2 id="draft-heading">{template.name}</h2>
                </div>
                <Send size={18} />
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
                  <dd>
                    {t.developers} / {t.publicLater}
                  </dd>
                </div>
              </dl>
              <button className="primary-button full-width action-spacer" onClick={handleDraftSubmit}>
                {draftState === 'loading' ? <Loader2 className="spin" size={17} /> : <Send size={17} />}
                <span>{t.submitDraft}</span>
              </button>
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
                {[
                  { label: 'Read template source', state: 'done' },
                  { label: 'Connect backend API adapter', state: 'done' },
                  { label: 'Submit draft request', state: draftState === 'success' ? 'done' : 'active' },
                  { label: 'Open generated preview', state: 'queued' },
                ].map((step) => (
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

function formatApiError(error: unknown, fallback: string) {
  const apiError = error as Partial<ApiError>;
  if (apiError?.message) {
    return apiError.status ? `${fallback} (${apiError.status}: ${apiError.message})` : `${fallback} (${apiError.message})`;
  }

  if (error instanceof Error) {
    return `${fallback} (${error.message})`;
  }

  return fallback;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
