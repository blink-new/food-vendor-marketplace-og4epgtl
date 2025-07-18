import React, { useState, useEffect, useRef } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { blink } from '../../blink/client'
import { useAuth } from '../../hooks/use-auth'

export function ChatTest() {
  const { user, isAuthenticated } = useAuth()
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!isAuthenticated || !user) return

    const initChat = async () => {
      try {
        setConnectionStatus('connecting')
        
        // Create test channel
        const testChannel = blink.realtime.channel('chat-test')
        
        // Subscribe to channel
        await testChannel.subscribe({
          userId: user.id,
          metadata: {
            displayName: user.displayName || user.email,
            userType: 'test'
          }
        })
        
        channelRef.current = testChannel
        setConnectionStatus('connected')
        
        // Listen for messages
        testChannel.onMessage((message: any) => {
          console.log('Received message:', message)
          setMessages(prev => [...prev, {
            id: message.id,
            text: message.data.text,
            sender: message.metadata?.displayName || 'Unknown',
            timestamp: new Date(message.timestamp)
          }])
        })
        
        // Get presence
        const users = await testChannel.getPresence()
        console.log('Current users:', users)
        
      } catch (error) {
        console.error('Chat initialization error:', error)
        setConnectionStatus('error')
      }
    }

    initChat()

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe()
      }
    }
  }, [isAuthenticated, user])

  const sendMessage = async () => {
    if (!newMessage.trim() || !channelRef.current || !user) return

    try {
      await channelRef.current.publish('chat', {
        text: newMessage,
        timestamp: Date.now()
      }, {
        userId: user.id,
        metadata: {
          displayName: user.displayName || user.email,
          userType: 'test'
        }
      })
      
      setNewMessage('')
    } catch (error) {
      console.error('Send message error:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6">
          <p>Please sign in to test chat functionality</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Chat Test - Status: {connectionStatus}</CardTitle>
        <p className="text-sm text-muted-foreground">
          User: {user?.displayName || user?.email}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64 border rounded p-4 overflow-y-auto bg-muted/20">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center">No messages yet. Send one to test!</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="mb-2 p-2 bg-background rounded">
                <div className="font-medium text-sm">{msg.sender}</div>
                <div>{msg.text}</div>
                <div className="text-xs text-muted-foreground">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a test message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={connectionStatus !== 'connected'}
          />
          <Button 
            onClick={sendMessage}
            disabled={!newMessage.trim() || connectionStatus !== 'connected'}
          >
            Send
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Connection Status: {connectionStatus}
        </div>
      </CardContent>
    </Card>
  )
}