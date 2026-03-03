
import "../App.css"

export default function LandingPage() {
  return (
    <div className="landingPageContainer">
      <nav>
        <div className='navHeader'>
          <h2>Meets</h2>
        </div>
        <div className='navList'>
          <p>Join as guest</p>
          <p>Register</p>
          <div role='button'>
            <p>Login</p>
          </div>
        </div>
      </nav>
      <div className="LandingMainContainer">
        <div>
          <h1>Meet your team, wherever you are</h1>
          <p>Connect. Build.</p>
          <div role='button'>
            <a href="/auth" style={{color:"#fceffa"}}>--Get started--</a>

            </div>
        </div>
        <div>
          <img src="/landing.png" alt="landing" />
        </div>
      </div>
    </div>

  
  )
}
