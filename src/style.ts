import styled from 'styled-components'

export const Container = styled.div`
  display: grid;
   grid-template-columns: repeat(3, 1fr);
   grid-column-gap: 10px;
   grid-row-gap: 1em;

   @media (max-width: 600px) {
    display: flex;
    flex-direction: column;
   }
`

export const SendButton = styled.button`
    display: flex;
    justify-content: center;
    
    border: none;
    padding: 5px;
    border-bottom: 2px solid #000;
    border-radius: 5px;
    background: #f44336;
    color: #fff;
    cursor: pointer;
`

export const SendInput = styled.input`
    display: flex;
    justify-content: center;
    
    border: none;
    padding: 5px;
    border-bottom: 2px solid #000;
    border-radius: 5px;
    background: #f44336;
    color: #fff;
    cursor: pointer;
`

export const DeleteButton = styled.button`
  border: none;
    padding: 5px;
    border-bottom: 2px solid #000;
    border-radius: 5px;
    background: #008CBA;
    color: #fff;
    cursor: pointer;
`

export const Card = styled.button`
display: grid;
  margin: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`