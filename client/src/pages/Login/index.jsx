import image from "../../assets/logo.png";
import { LoginForm } from "../../components";

export default function Login() {
  return (
    <>
      <div className="wrapper">
        <div className="container main">
          <div className="row login">
            <div className="col-md-6 side-image">
              <img src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/000/605/674/datas/original.jpg" alt="logo" width="420px"/>
            </div>
            <div className="col-md-6 right">
              <div className="small-logo">
                <img src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/000/605/674/datas/original.jpg" alt="" />
              </div>
              <div className="input-box">
                <header>Welcome to Learnt.me</header>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
