//import { Link } from "react-router-dom"
import './filme.css'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
//import { Toast } from 'react-toastify/dist/components'
import { toast } from 'react-toastify'

function Filme() {
    const { id } = useParams()
    const [filme, setFilme] = useState({})
    const [loading, setLoading] = useState(true)

    const navigation = useNavigate()

    useEffect(() => {
        async function loadFilme() {
            await api.get(`/movie/${id}`, {
                params: {
                    api_key: "2b2b578777fe758b60949c4cabf38eae",
                    language: "pt-Br",
                }
            })
                .then((r) => {
                    setFilme(r.data)
                    setLoading(false)
                })
                .catch(() => {
                    navigation("/", {replace: true})
                    return
                })
        }

        loadFilme()

        return () => {
            console.log("Componente foi desmontado");
        }
    }, [navigation, id])

    const salvarFilme = () => {
        const minhaLista = localStorage.getItem("@primeflix")

        let filmesSalvos = JSON.parse(minhaLista) || []

        const hasFilmes = filmesSalvos.some((filmesSalvos) => filmesSalvos.id === filme.id)
        
        if (hasFilmes) {
            toast.warn("Esse filme já está na lista")
            return
        }

        filmesSalvos.push(filme)
        localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos))
        toast.success("Filme salvo com sucesso !!")
    
    }

    if (loading) {
        return (
            <div className='filme-info'>
                <h1>Carregando detalhes..</h1>
            </div>
        )
    }

    return (
        <div className="filme-info">
            <h1>{filme.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`} alt={filme.title} />

            <h3>Sinopse</h3>
            <span>{filme.overview}</span>
            <strong>Avaliação do filme: <span>{filme.vote_average} /10</span></strong>

            <div className='area-buttons'>
                <button onClick={salvarFilme}>Salvar</button>
                <button>
                    <a target="blank" rel='noreferrer' href={`https://youtube.com/results?search_query=${filme.title} trailer`}>Trailer</a>
                </button>
            </div>

        </div>
    )
}

export default Filme