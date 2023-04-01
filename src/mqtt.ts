// @ts-ignore
import * as mqtt from 'mqtt/dist/mqtt.min'

export class MQTT {
  client: mqtt
  ip: string
  
  constructor(ip: string) {
    this.ip = ip
    this.client  = mqtt.connect(`ws://${this.ip}:9001`)

    this.client.on("connect", () => {
      console.log("connected");
    })
  }

  publish(topic: string, message: JSON) {
    this.client.publish(topic, JSON.stringify(message))
  }
}