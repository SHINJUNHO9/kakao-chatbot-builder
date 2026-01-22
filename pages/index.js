export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🏥 카카오 챗봇 빌더
        </h1>
        <p style={{ fontSize: '1.5rem', color: '#666' }}>
          개발 중입니다...
        </p>
        <p style={{ marginTop: '2rem', color: '#999' }}>
          곧 완성됩니다! 🚀
        </p>
      </div>
    </div>
  );
}
