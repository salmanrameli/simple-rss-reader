import {getProfile, getStream, getEntry} from './Constants'

export default function test() {
    let a = getProfile()
    console.log(a)

    let b = getStream('test', true)
    console.log(b)

    let c = getEntry('PSNTZO8gXFUe+cpCZyApw0vEKWPT4b14D6teBEocIAE=_16bc152bcb4:3a4bf81:561e4df6')
    console.log(c)
}