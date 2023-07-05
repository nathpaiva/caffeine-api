import { Button, ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
import { HashRouter, Link, Route, Routes } from 'react-router-dom'

import { Home, NotFound } from './pages'

// const NewButton = styled(Button)`
//   background-color: ${({ theme }) => theme.color.brand.900};
// `

function App() {
  return (
    <div>
      {/* <Button>Hello</Button> */}
      <h1>My title</h1>

      <Link to="/">Home</Link>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendBaseTheme({ colors })

function WrapperApp() {
  return (
    <ChakraBaseProvider theme={theme}>
      <HashRouter>
        <App />
      </HashRouter>
    </ChakraBaseProvider>
  )
}

export default WrapperApp
