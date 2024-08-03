import React, { useState } from 'react'
import Nav from './component/nav'
import Table from './component/table/table'

function Home() {
  const [count, setCount] = useState(0); // สร้าง variable (defult value = 0)

  return (
    <>
      <Nav />
      <Table />
    </>
  )
}

export default Home