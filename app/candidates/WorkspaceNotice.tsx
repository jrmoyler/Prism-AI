export default function WorkspaceNotice({ source }: { source: string }) {
  const messages: Record<string, string> = {
    demo: 'Demo workspace · These sample records are fictional. Changes are disabled. Connect a hiring workspace to use real candidate data.',
    unavailable: 'Candidate data could not be loaded. No sample records have been substituted. Reload this page to try again.',
    forbidden: 'This workspace is restricted to hiring administrators. Contact your workspace owner for access.',
    unauthenticated: 'Sign in with an authorized hiring account to view candidate records.',
    live: 'Connected workspace · Candidate records loaded from your hiring database.',
  }
  return <aside role={source === 'unavailable' ? 'alert' : 'status'} className="border-l-2 px-4 py-4 text-sm leading-relaxed" style={{borderColor:source === 'live' ? '#00D9B5' : '#D4A843',background:'#0D1326',color:'#C5CEDA'}}>{messages[source] ?? messages.unavailable}{source === 'unauthenticated' && <a href="/login" className="ml-2 underline">Sign in</a>}</aside>
}
