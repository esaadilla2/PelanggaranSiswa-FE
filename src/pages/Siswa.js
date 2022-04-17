import { useState, useEffect } from "react";
import axios, { Axios } from "axios";

export default function Siswa() {
    let [siswa, setSiswa] = useState([])
    
    let token = localStorage.getItem(`token-pelanggaran`)
    let authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // ambil data dari backend
    let getData= () => {
        let endpoint = `http://localhost:8080/siswa`

        axios.get(endpoint, authorization)
        .then(response => {
            // simpan ke state siswa
            setSiswa(response.data)
        })
        .catch(error => console.log(error))
    }

    useEffect(() => {
        getData()
    }, [])

    return(
        <div className="container-fluid">
            <div className="card">
                <div className="card-header" style={{background: `slateBlue`}}>
                    <h4 className="text-white">
                        Data Siswa
                    </h4>
                </div>
                <div className="card-body">
                    <ul className="list-group">
                        {siswa.map(item => (
                            <li className="list-group-item"
                            key={`key-${item.id_siswa}`}>
                                <div className="row">
                                    {/** buat gambar */}
                                    <div className="col-4">
                                        <img src={`http://localhost:8080/image/${item.image}`} alt="Foto Orang Cakep"
                                        style={{width: `250px`, height: `250px`, borderRadius: `50%`}}/>
                                    </div>
                                    {/** buat desc */}
                                    <div className="col-8">
                                        <small className="text-info">Nama</small>
                                        <h5>{item.nama}</h5>
                                        <small className="text-info">Kelas</small>
                                        <h5>{item.kelas}</h5>
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