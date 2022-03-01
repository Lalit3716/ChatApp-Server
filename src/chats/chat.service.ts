import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatDocument, Chat } from './schemas/chat.schema';
import { UserDocument } from 'src/users/schemas/user.schema';
import { FriendDocument } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async create(chat: Chat) {
    const newChat = new this.chatModel(chat);
    return await newChat.save();
  }

  async findAll(roomId: string): Promise<ChatDocument[]> {
    const [user1, user2] = roomId.split('-');
    return await this.chatModel
      .find({
        sender: { $in: [user1, user2] },
        receiver: { $in: [user1, user2] },
      })
      .sort({ createdAt: -1 });
  }

  async getLastMessage(roomId: string): Promise<ChatDocument> {
    const [user1, user2] = roomId.split('-');
    return await this.chatModel
      .findOne({
        sender: { $in: [user1, user2] },
        receiver: { $in: [user1, user2] },
      })
      .sort({ createdAt: -1 });
  }

  async updateWithLastMessages(
    userId: string,
    friends: UserDocument[],
  ): Promise<FriendDocument[]> {
    const hydratedFriends = await Promise.all(
      friends.map(async (friend) => {
        const lastMessage = await this.getLastMessage(
          [userId, friend._id].sort().join('-'),
        );
        return {
          _id: friend._id,
          username: friend.username,
          email: friend.email,
          lastMessage: lastMessage ? lastMessage.message : null,
          lastMessageCreatedAt: lastMessage ? lastMessage.createdAt : null,
          online: friend.online,
        };
      }),
    );
    return hydratedFriends;
  }
}
