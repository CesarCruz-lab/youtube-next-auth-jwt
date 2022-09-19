import { v4 as uuid } from 'uuid'

type SignInRequestData = {
  email: string
  password: string
}

const mock = {
  user: {
    name: 'César',
    email: 'cesar@email.com',
    avatar_url: 'https://github.com/CesarCruz-lab.png',
  },
}

const delay = (amount: number) => new Promise(resolve => setTimeout(resolve, amount))

export async function signInRequest({ email, password }: SignInRequestData) {
  await delay(500)

  return {
    token: uuid(),
    user: mock.user,
  }
}

export async function recoverUserInformation() {
  await delay(500)

  return {
    user: mock.user,
  }
}
