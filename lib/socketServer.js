import { Server as NetServer } from "http"
import { NextApiRequest, NextApiResponse } from "next"
import { Server as ServerIO } from "socket.io"

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponse & { socket: any }) => {
  if (res.socket.server.io) {
    console.log("Socket is already running")
  } else {
    console.log("Socket is initializing")
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    // Store aerator states
    let aeratorStates = [
      { id: 1, name: 'Aerator 1', status: false },
      { id: 2, name: 'Aerator 2', status: false },
      { id: 3, name: 'Aerator 3', status: false },
      { id: 4, name: 'Aerator 4', status: false },
      { id: 5, name: 'Aerator 5', status: false },
      { id: 6, name: 'Aerator 6', status: false },
      { id: 7, name: 'Aerator 7', status: false },
      { id: 8, name: 'Aerator 8', status: false },
    ]

    // Handle socket connections
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // Send current aerator states to newly connected client
      socket.emit("aerator-states", aeratorStates)

      // Handle aerator toggle requests
      socket.on("toggle-aerator", (data) => {
        const { aeratorId, status } = data
        
        // Validate input
        if (!aeratorId || typeof status !== 'boolean') {
          socket.emit("error", { message: "Invalid input" })
          return
        }

        if (aeratorId < 1 || aeratorId > 8) {
          socket.emit("error", { message: "Invalid aerator ID" })
          return
        }

        // Find and update the aerator
        const aeratorIndex = aeratorStates.findIndex(a => a.id === aeratorId)
        if (aeratorIndex === -1) {
          socket.emit("error", { message: "Aerator not found" })
          return
        }

        // Update the status
        aeratorStates[aeratorIndex].status = status
        
        // Simulate hardware communication delay
        setTimeout(() => {
          // Broadcast the updated state to all clients
          io.emit("aerator-updated", {
            id: aeratorId,
            status: status,
            timestamp: new Date().toISOString()
          })
          
          // Send updated states to all clients
          io.emit("aerator-states", aeratorStates)
          
          console.log(`Aerator ${aeratorId} turned ${status ? 'ON' : 'OFF'}`)
        }, 300)
      })

      // Handle toggle all aerators
      socket.on("toggle-all-aerators", (data) => {
        const { status } = data
        
        // Validate input
        if (typeof status !== 'boolean') {
          socket.emit("error", { message: "Invalid input" })
          return
        }

        // Update all aerators
        aeratorStates.forEach(aerator => {
          aerator.status = status
        })
        
        // Simulate hardware communication delay
        setTimeout(() => {
          // Broadcast the updated state to all clients
          io.emit("all-aerators-updated", {
            status: status,
            timestamp: new Date().toISOString()
          })
          
          // Send updated states to all clients
          io.emit("aerator-states", aeratorStates)
          
          console.log(`All aerators turned ${status ? 'ON' : 'OFF'}`)
        }, 500)
      })

      // Handle auto mode changes
      socket.on("set-auto-mode", (data) => {
        const { isAutoMode, activeCount } = data
        
        // Validate input
        if (typeof isAutoMode !== 'boolean' || typeof activeCount !== 'number') {
          socket.emit("error", { message: "Invalid input" })
          return
        }

        // Update aerators based on mode
        if (isAutoMode) {
          // In auto mode, turn all aerators on
          aeratorStates.forEach(aerator => {
            aerator.status = true
          })
        } else {
          // In manual mode, set the specified number of aerators to active
          aeratorStates.forEach((aerator, index) => {
            aerator.status = index < activeCount
          })
        }
        
        // Simulate processing delay
        setTimeout(() => {
          // Broadcast the updated state to all clients
          io.emit("auto-mode-updated", {
            isAutoMode: isAutoMode,
            activeCount: activeCount,
            timestamp: new Date().toISOString()
          })
          
          // Send updated states to all clients
          io.emit("aerator-states", aeratorStates)
          
          console.log(`Auto mode set to: ${isAutoMode ? 'ON' : 'OFF'}`)
        }, 200)
      })

      // Handle disconnections
      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })

    res.socket.server.io = io
  }
  res.end()
}

export default SocketHandler