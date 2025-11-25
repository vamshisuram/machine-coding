import './App.css'
import {Pagination} from './Pagination';


const data = {
  totalRecords: 74,
  pageSize: 5,
  onClick: ({ pageNum, buttonType, pageSize, totalRecords }) => console.log({ pageNum, buttonType, pageSize, totalRecords })
};

function App() {

  return (
    <>
      <Pagination {...data}/>
    </>
  )
}

export default App
