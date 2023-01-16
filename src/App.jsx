import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getDoc, getFirestore, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable, } from "firebase/storage";
import { useEffect, useState } from "react";
import { Avatar, Button, TextField, } from "@mui/material";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// imports 

import * as S from './style'

function App() {
  const [name, setName] = useState('') // armazenar informações especificas do usuario
  const [email, setEmail] = useState('')
  const [petname, setPetname] = useState('')
  const [selectedCard, setSelectedCard] = useState({})

  const [open, setOpen] = useState(false);

  const handleModal = (card) => {
    setSelectedCard(card)
    setOpen(!open)
  }

  const clearData = () => {
    setName('')
    setEmail('')
    setPetname('')
    setImgObject({})
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [users, setUsers] = useState([]) // armazena todos os usuarios cadastrados na aplicação

  const [progress, setProgress] = useState(0)
  const [imgObject, setImgObject] = useState()

  const db = getFirestore(firebaseConfig) // acessa o banco de dados de acordo com a configuração dada pelo FB
  const useCollectionRef = collection(db, 'users') // acessa dentro do banco de dados a tabela de usuarios

  // Add a new document with a generated id.
  const storage = getStorage();

  const getUsers = async () => {
    const data = await getDocs(useCollectionRef)
    console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))) // tras somente os dados cadastrados no db
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))) // armazena na variavel Users os dados
  }

  const criarUser = async () => { // função para criação de usuario
    await handleUpload(imgObject)
  }

  const handleUpload = (event) => {
    event.preventDefault();
    const file = event.target?.files[0]
    if (!file) return;

    const storageRef = ref(storage, `images/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(progress)
      },
      error => {
        alert(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async url => {
          await addDoc(useCollectionRef, {  // adiciona no banco de dados os campos nome e email
            name,
            email,
            petname,
            image: url,
          }).then(() => {
            getUsers()
            clearData()
          })
        })
      }
    )
  }



  async function deletarUsuario(id) {
    const userDoc = doc(db, 'users', id)
    await deleteDoc(userDoc) //Deleta dentro do banco o documento pelo ID
    getUsers()
  }

  async function atualizarUsuario(id) {
    const userDoc = doc(db, 'users', id)
    await updateDoc(userDoc, {
      name: name,
      email: email,
      petname: petname,
    })
  }

  
  async function getUser(id) {
    const userDoc = doc(db, 'users', id)
    const user = await getDoc(userDoc)

    return await user.data()
  }
  // função para conferir as informações vindas do Banco de dados ( db )
  useEffect(() => {
    getUsers()
  }, [name]) // atualiza o hook depois do useState ser atualizado

  return (
    <div>
      <S.Container>
        <TextField
          sx={{ background: '#fff' }}
          id="filled-basic"
          variant="filled"
          type={'text'}
          placeholder="Nome..."
          value={name} // valor do input
          onChange={(e) => setName(e.target.value)} //armazena os dados do campo
          size="small"
        />
        <TextField
          sx={{ background: '#fff' }}
          id="filled-basic"
          variant="filled"
          type={'text'}
          placeholder="Email..."
          value={email} // valor do input
          onChange={(e) => setEmail(e.target.value)} //armazena os dados do campo
          size="small"
        />
        <TextField
          sx={{ background: '#fff' }}
          id="filled-basic"
          variant="filled"
          type={'text'}
          placeholder="Nome do Pet..."
          value={petname} // valor do input
          onChange={(e) => setPetname(e.target.value)} //armazena os dados do campo
          size="small"
        />
          <S.SendInput
            type="file"
            accept="image/*"
            onChange={(e) => setImgObject(e)}
          />



        {!imgObject && <progress value={progress} max="100" />}
        {imgObject && <img style={{ width: 30, height: 30 }} src={imgObject?.target?.files[0] ? URL.createObjectURL(imgObject.target.files[0]) : null} alt="Imagem" />}

      </S.Container>

      <S.SendButton onClick={() => criarUser()}>
        Cadastrar usuário
      </S.SendButton>

      <S.Container>
        {
          users.map((user) => { // mapeia todos os usuarios retornando um usuario
            return (
              <>
                <S.Card key={user.id}>
                  <p>Nome: {user.name}</p>
                  <p>Pet: {user.petname}</p>
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    <Avatar
                      sx={{
                        background: '#000'
                      }}
                      alt="Remy Sharp"
                      src={user.image} />
                  </div>
                  <Button sx={{ m: 5 }} variant="contained" onClick={() => handleModal(user)}>Consultar</Button>
                  <S.DeleteButton onClick={() => deletarUsuario(user.id)}>Deletar</S.DeleteButton>
                  <S.SendButton onClick={() => atualizarUsuario(user.id)}>Atualizar usuário</S.SendButton>
                </S.Card>
              </>
            )
          })
        }

        <Modal
          open={open}
          onClose={() => handleModal({})}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{display: 'flex', justifyContent: 'center', textAlign: 'center',}}
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <p>{selectedCard.name}</p>
            </Typography>
            <Typography>
              <img style={{width: 200, height: 200, borderRadius: '100%'}} src={selectedCard.image} alt="" />
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {selectedCard.email}
            </Typography>
          </Box>
        </Modal>

      </S.Container>
    </div >
  );
}


// configurações necessárias do firebase 
const firebaseConfig = initializeApp({
  apiKey: "AIzaSyDY1P8DKrnCaQuBWgBG90VDBoppXoBGYUo",
  authDomain: "reactfirebase-aac94.firebaseapp.com",
  projectId: "reactfirebase-aac94",
  storageBucket: 'reactfirebase-aac94.appspot.com'
});

export default App;
