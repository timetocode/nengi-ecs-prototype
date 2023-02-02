import { WsClientAdapter } from 'nengi-ws-client-adapter'
import { Client } from 'nengi'
import { ncontext } from '../common/ncontext'
import { NType } from '../common/NType'

const input: any = {
    w: false,
    a: false,
    s: false,
    d: false
}

const randomBoolean = () => {
    return Math.random() > 0.5
}

const entities = new Map()


const foo = async  () => {
    const clients: Client[] = []

    for (let i = 0; i < 200; i++) {
        const client = new Client(ncontext, WsClientAdapter)
        try {
            // AWAIT is deliberately missing from this line so that it connects
            // more bots as fast as possible instead of waiting for connections to finish
            // opening in serial
            const res = client.connect('ws://localhost:9001', { token: 12345 })
            console.log('got this', res)
            clients.push(client)
        } catch (err) {
            console.log('err', err)
            return
        }
    }

    let prev = performance.now()

    const loop = () => {
        setTimeout(loop, 50)
        //window.setTimeout(loop, 1000)
        const now = performance.now()
        const delta = (now - prev) / 1000
        prev = now

        clients.forEach(client => {
            input.w = randomBoolean()
            input.a = randomBoolean()
            input.s = randomBoolean()
            input.d = randomBoolean()

            const { w, a, s, d } = input

            client.addCommand({
                ntype: NType.Command,
                w,
                a,
                s,
                d,
                delta
            })
            client.flush()
        })
    }

    loop()
}

foo()
