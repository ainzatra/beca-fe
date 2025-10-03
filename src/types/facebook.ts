export type CampaignPhase = string;

export interface FacebookPost {
  id: string;
  campaignId: string;
  phase: CampaignPhase;
  content?: string;
  url: string;
  timestamp: Date;
  likes: number;
  shares: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  facebookComments: FacebookComment[];
}

export interface FacebookComment {
  id: string;
  postId: string;
  phase: CampaignPhase;
  content?: string;
  authorName?: string;
  timestamp: Date;
  url: string;
  likes: number;
  replies: number;
  createdAt: Date;
  updatedAt: Date;
}
