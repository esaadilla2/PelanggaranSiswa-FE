import { useState, useEffect } from "react";
import axios from "axios";
import { Toast } from "bootstrap";

export default function Pelanggaran(){
    let [pelanggaran, setPelanggaran] = useState([])
    let [message, setMessage] = useState("")

    // get token from localstorage
    let token = localStorage.getItem(`token-pelanggaran`)

    let authorization = {
        headers: {
            Authoriztion: `Bearer ${token}`
        }
    }

    // create function to show toast
    let showToast = message => {
        let myToast = new Toast(
            document.getElementById(`myToast`),
            {
                autohide: true
            }
        )
        // perintah untuk mengisi state
        setMessage(message)

        // show Toast
        myToast.show()
    }

    // create function to get data pelanggaran from backend
    let getData = () => {
        /**
         * endpoint = http://localhost:8080/user
         * method = GET
         * req = none
         * res = array data pelanggaran
         * auth = bearer token
         */
        let endpoint = `http://localhost:8080/pelanggaran`
        
        // sending data
        axios.get(endpoint, authorization)
        .then(response => {
            setPelanggaran(response.data)

            // call showToast
            showToast(`Data pelanggaran berhasil dimuat`)
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <div className="container-fluid">

            {/** start component toast */}
            <div className="position-fixed top-0 end-0 p-3"
            style={{zIndex: 1}}>
                <div className="toast bg-light" id="myToast">
                    <div className="toast-header bg-info text-white">
                        <strong>Message</strong>
                    </div>
                    <div className="toast-body">
                        {message}
                    </div>
                </div>
            </div>
            {/** end component toast */}

            <div className="card md-2">
                <div className="card-header"
                style={{background: `mediumPurple`}}>
                    <h4 className="text-white">Daftar Jenis Pelanggaran</h4>
                </div>

                <div className="card-body">
                    <ul className="list-group">
                        {pelanggaran.map(item => (
                            <li className="list-group-item">
                            <div className="row">
                                <div className="col-3">
                                    <small className="text-info">ID Pelanggaran</small>
                                    <h5>{item.id_pelanggaran}</h5>
                                </div>
                                <div className="col-6">
                                <small className="text-info">Jenis Pelanggaran</small>
                                    <h5>{item.nama_pelanggaran}</h5>
                                </div>
                                <div className="col-3">
                                <small className="text-info">Poin</small>
                                    <h5>{item.poin}</h5>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}