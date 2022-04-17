import { useState } from "react";
import axios from "axios";

// axios adalah library yang digunakan untuk transfer data atau komunikasi ke back-end; 
// front-end -> back-end

export default function Login() {
    let [uname, setUname] = useState("")
    let [password, setPassword] = useState("")

    let loginProcess = ev => {
        ev.preventDefault()
        // akses ke back-end untuk proses login
        // method: POST; endpoint: http://localhost:8080/user/auth
        // req: username & password
        // res: logged & token

        let request = {
            username: uname,
            password: password
        }

        let endpoint = `http://localhost:8080/user/auth`

        // mengirim data
        axios.post(endpoint, request)
        .then(response => {
            if (response.data.logged === true) {
                let token = response.data.token
                // menyimpan token pada localstorage di browser
                localStorage.setItem(`token-pelanggaran`, token)
                alert(`Login Berhasil`)
            } else {
                alert(response.data.message)
            }
        })
        .catch(error => {
            console.log(error);
        })
    }

    return(
        <div className="container">
            <div className="card">
                <div className="card-header" style={{background: `teal`}}>
                    <h4 className="text-white">
                        Sign in
                    </h4>
                </div>
                <div className="card-body">
                    <form onSubmit={ev => loginProcess(ev)}>
                        <h5>Username</h5>
                        <input type={`text`} className="form-control mb-2" required
                        value={uname}
                        onChange={(ev) => setUname(ev.target.value)}/>

                        <h5>Password</h5>
                        <input type={`password`} className="form-control mb-2" required
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}/>

                        <button type="submit" className="btn btn-success">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    )
}