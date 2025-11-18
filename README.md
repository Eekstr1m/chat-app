# 💬 Real-Time Chat Application

A full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.IO. Features include instant messaging, voice messages, read receipts, user presence, and more.

## 🚀 Features

### Core Features

- **Real-time Messaging**: Instant message delivery using WebSocket (Socket.IO)
- **Voice Messages**: Record and send audio messages with waveform visualization
- **Read Receipts**: Track message read status with visual indicators
- **Reply to Messages**: Reply to specific messages with context preview
- **User Presence**: See online/offline status of users
- **Unread Message Counters**: Track unread messages per conversation
- **Infinite Scroll**: Efficient pagination for message history
- **User Search**: Search users by name or username
- **Profile Management**: Upload and crop profile pictures
- **Follow Conversations**: Follow/unfollow users to manage conversation list
- **Emoji Support**: Rich emoji picker for messages
- **Responsive Design**: Mobile-friendly UI with Chakra UI

### Technical Features

- **JWT Authentication**: Secure cookie-based authentication
- **Cloud Storage**: Avatar uploads to Cloudflare R2 (S3-compatible)
- **Optimistic Updates**: Instant UI updates with React Query
- **Context Menus**: Right-click actions on messages (reply, copy, delete)
- **Auto-scroll**: Smart scrolling based on user position
- **Message Status**: Real-time status updates via Socket.IO

## 🛠️ Tech Stack

### Backend

- **Node.js** with **Express.js** - RESTful API server
- **TypeScript** - Type-safe backend code
- **MongoDB** with **Mongoose** - Database and ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** (jsonwebtoken) - Authentication tokens
- **bcryptjs** - Password hashing
- **AWS SDK** - Cloudflare R2 integration for file storage
- **Multer** - File upload handling

### Frontend

- **React 19** - UI library
- **TypeScript** - Type-safe frontend code
- **Vite** - Build tool and dev server
- **Chakra UI** - Component library
- **TanStack Query** (React Query) - Server state management
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Emoji Picker React** - Emoji selection
- **React Image Crop** - Image cropping for avatars
- **React Voice Visualizer** - Audio recording and visualization
