import { useState, useEffect } from "react";
import axios from "axios";
import { Toast } from "bootstrap";
import { Modal } from "bootstrap";

export default function Pelanggaran(){
    let [pelanggaran, setPelanggaran] = useState([])
    let [message, setMessage] = useState("")
    let [idPelanggaran, setIdPelanggaran] = useState(0)
    let [namaPelanggaran, setNamaPelanggaran] = useState("")
    let [poin, setPoin] = useState(0)
    let [action, setAction] = useState("")
    let [modal, setModal] = useState(null)

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
         * endpoint = http://localhost:8080/pelanggaran
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
            //showToast(`Data pelanggaran berhasil dimuat`)
        })
        .catch(error => console.log(error))
    }

    let tambahData = () => {
        // display modal
        modal.show()

        // mengosongkan inputan formnya
        setIdPelanggaran(0)
        setNamaPelanggaran("")
        setPoin(0)
        setAction('insert')
    }

    let editData = item => {
        // display modal
        modal.show()

        // isi form sesuai data yang dipilih
        setIdPelanggaran(item.id_pelanggaran)
        setNamaPelanggaran(item.nama_pelanggaran)
        setPoin(item.poin)
        setAction('edit')
    }

    let simpanData = event => {
        event.preventDefault()
        
        // close modal
        modal.hide()
        
        if ( action === "insert"){
            let endpoint = `http://localhost:8080/pelanggaran`
            let request = {
                nama_pelanggaran: namaPelanggaran,
                poin: poin
            }

            // send data
            axios.post(endpoint, request, authorization)
            .then(response => {
                showToast(response.data.message)

                // refresh data -> mengambil lagi data yang terbaru dari database 
                getData()
            })
            .catch(error => console.log(error))
        } else if (action === "edit") {
            let endpoint = `http://localhost:8080/pelanggaran/${idPelanggaran}`
            let request = {
                nama_pelanggaran: namaPelanggaran,
                poin: poin
            }

            // send data
            axios.put(endpoint, request, authorization)
            .then(response =>{
                showToast(response.data.message)

                // refresh data
                getData()
            })
            .catch(error => console.log(error))
        }
    }

    let hapusData = item => {
        if(window.confirm(`Do you want to delete this?`)){
            let endpoint = `http://localhost:8080/pelanggaran/${item.id_pelanggaran}`

            // send data
            axios.delete(endpoint, authorization)
            .then(response => {
                showToast(response.data.message)

                // refresh data
                getData()
            })
            .catch(error => console.log(error))
        }
    }

    useEffect(() => {
        let modal = new Modal(document.getElementById("modalPelanggaran"))
        setModal(modal)
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
                                <div className="col-2">
                                    <small className="text-info">ID Pelanggaran</small>
                                    <h5>{item.id_pelanggaran}</h5>
                                </div>
                                <div className="col-6">
                                <small className="text-info">Jenis Pelanggaran</small>
                                    <h5>{item.nama_pelanggaran}</h5>
                                </div>
                                <div className="col-2">
                                <small className="text-info">Poin</small>
                                    <h5>{item.poin}</h5>
                                </div>
                                <div className="col-2">
                                    <small className="text-info">Option</small>
                                    <br/>
                                    <button className="btn btn-sm btn-info mx-1"
                                    onClick={() => editData(item)}>
                                        <span className="fa fa-edit"></span>
                                    </button>
                                    <button className="btn btn-sm btn-danger mx-1"
                                    onClick={() => hapusData(item)}>
                                        <span className="fa fa-trash"></span>
                                    </button>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>

                    {/** button tambah */}
                    <button className="btn btn-sm btn-success my-2"
                    onClick={() => tambahData()}>
                        <span className="fa fa-plus"></span> Tambah data
                    </button>

                    {/** modal isinya form u/ data pelanggaran */}
                    <div className="modal" id="modalPelanggaran">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-info">
                                    <h4 className="text-white">Form Pelanggaran</h4>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={ev => simpanData(ev)}>
                                        Jenis Pelanggaran
                                        <input type="text" className="form-control mb-2" 
                                        required
                                        onChange={e => setNamaPelanggaran(e.target.value)}
                                        value = {namaPelanggaran}/>
                                        
                                        Poin
                                        <input type="number" className="form-control mb-2" 
                                        required
                                        onChange={e => setPoin(e.target.value)}
                                        value = {poin}/>

                                        <button className="btn btn-success">
                                            <span className="fa fa-check"></span> Simpan
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}