import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";


function Footerbar() {
  return (
    <footer style={{
      borderTop: '1px solid #e0e0e0',
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      fontSize: '14px',
      color: '#555',
      marginTop: '32px',
      textAlign: 'center'
    }}>


        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ cursor: 'pointer' }}>Sobre nosotros</span>
        <span style={{ cursor: 'pointer' }}>Privacidad</span>
        <span style={{ cursor: 'pointer' }}>Soporte Técnico</span>
        <span style={{ cursor: 'pointer' }}>Términos y condiciones</span>
      </div>

     <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
  <span>🌐 Español (ES)</span>
  <span>$ USD</span>
  
  <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
    <div style={{
      backgroundColor: '#E1306C',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }}>
      <FaInstagram color="white" />
    </div>
  </a>

  <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
    <div style={{
      backgroundColor: 'black',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }}>
      <FaXTwitter color="white" />
    </div>
  </a>
</div>

      <div>© 2026 Nomada, Inc.</div>

    </footer>
  );
}

export default Footerbar;