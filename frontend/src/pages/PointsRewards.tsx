import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Star, 
  ArrowLeft, 
  Gift, 
  Calendar, 
  Award, 
  TrendingUp, 
  Users, 
  ShoppingBag,
  ChevronRight
} from "lucide-react";
import { UserProfile } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

// Mock user data (would come from API/context in real app)
const USER_PROFILE: UserProfile = {
  id: "user1",
  name: "Vivek Kumar",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  level: 3,
  points: 750,
  badges: ["Early Adopter", "Social Butterfly", "Group Buy Expert"],
  rank: "Campus Explorer"
};

// Mock points history
const POINTS_HISTORY = [
  { id: 1, date: "May 18, 2023", points: 50, type: "earned", description: "Completed first order" },
  { id: 2, date: "May 15, 2023", points: 100, type: "earned", description: "Referred a friend" },
  { id: 3, date: "May 10, 2023", points: -200, type: "spent", description: "Redeemed $5 discount" },
  { id: 4, date: "May 5, 2023", points: 75, type: "earned", description: "Left a review" },
  { id: 5, date: "Apr 28, 2023", points: 25, type: "earned", description: "Joined a group buy" },
  { id: 6, date: "Apr 22, 2023", points: 200, type: "earned", description: "Completed 5 orders" },
];

// Mock available rewards
const AVAILABLE_REWARDS = [
  { id: 1, title: "$5 Discount", points: 200, description: "Get $5 off your next order" },
  { id: 2, title: "Free Delivery", points: 150, description: "Free delivery on your next order" },
  { id: 3, title: "Priority Service", points: 300, description: "Skip the queue on your next order" },
  { id: 4, title: "Exclusive Item", points: 500, description: "Unlock a limited edition campus item" },
];

// Mock challenges
const CHALLENGES = [
  { id: 1, title: "First Group Buy", points: 50, progress: 0, total: 1, description: "Join your first group buy" },
  { id: 2, title: "Social Sharer", points: 100, progress: 2, total: 5, description: "Share 5 products with friends" },
  { id: 3, title: "Review Master", points: 150, progress: 3, total: 10, description: "Leave 10 reviews" },
  { id: 4, title: "Loyal Customer", points: 200, progress: 4, total: 10, description: "Complete 10 orders" },
];

// Mock tier benefits
const TIER_BENEFITS = [
  { level: 1, title: "Freshman", pointsNeeded: 0, benefits: ["Basic discounts", "Join group buys"] },
  { level: 2, title: "Sophomore", pointsNeeded: 500, benefits: ["5% extra points", "Priority support"] },
  { level: 3, title: "Junior", pointsNeeded: 1000, benefits: ["10% extra points", "Exclusive rewards", "Early access"] },
  { level: 4, title: "Senior", pointsNeeded: 2000, benefits: ["15% extra points", "VIP support", "Special events", "Custom offers"] },
];

const PointsRewards: React.FC = () => {
  const navigate = useNavigate();
  const currentTier = TIER_BENEFITS.find(tier => tier.level === USER_PROFILE.level);
  const nextTier = TIER_BENEFITS.find(tier => tier.level === USER_PROFILE.level + 1);
  
  // Calculate progress to next tier
  const currentTierPoints = currentTier ? currentTier.pointsNeeded : 0;
  const nextTierPoints = nextTier ? nextTier.pointsNeeded : currentTierPoints + 1000;
  const pointsForNextTier = nextTierPoints - currentTierPoints;
  const progressToNextTier = Math.min(100, Math.floor(((USER_PROFILE.points - currentTierPoints) / pointsForNextTier) * 100));
  
  return (
    <div className="max-w-screen-xl mx-auto pb-24 section-padding">
      <div className="animate-fade-in">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Points & Rewards</h1>
        </div>
        
        {/* Points overview card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Points Overview</CardTitle>
            <CardDescription>Current status and progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gantry-purple/10 flex items-center justify-center mr-4">
                  <Star className="w-8 h-8 text-gantry-purple fill-gantry-purple" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available Points</p>
                  <p className="text-3xl font-bold">{USER_PROFILE.points}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{currentTier?.title || "Level 1"}</span>
                  <span className="text-sm font-medium">{nextTier?.title || "Max Level"}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div className="bg-gantry-purple h-2.5 rounded-full" style={{ width: `${progressToNextTier}%` }}></div>
                </div>
                <p className="text-xs text-gray-500">
                  {pointsForNextTier - (USER_PROFILE.points - currentTierPoints)} more points to {nextTier?.title || "Max Level"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for different sections */}
        <Tabs defaultValue="history" className="w-full">
          <div className="relative mb-6 overflow-x-auto">
            <TabsList className="w-full inline-flex whitespace-nowrap min-w-full sm:grid sm:grid-cols-4">
              <TabsTrigger value="history" className="flex-1 sm:flex-none">History</TabsTrigger>
              <TabsTrigger value="rewards" className="flex-1 sm:flex-none">Rewards</TabsTrigger>
              <TabsTrigger value="achievements" className="flex-1 sm:flex-none">Achievements</TabsTrigger>
              <TabsTrigger value="opportunities" className="flex-1 sm:flex-none">Opportunities</TabsTrigger>
            </TabsList>
          </div>
          
          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Points History
                </CardTitle>
                <CardDescription>Your points activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {POINTS_HISTORY.map(item => (
                    <div key={item.id} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">{item.date}</p>
                      </div>
                      <p className={`font-semibold ${item.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.type === 'earned' ? '+' : '-'}{Math.abs(item.points)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Gift className="mr-2 h-5 w-5" />
                  Available Rewards
                </CardTitle>
                <CardDescription>Redeem your points for these rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {AVAILABLE_REWARDS.map(reward => (
                    <div key={reward.id} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium">{reward.title}</p>
                        <p className="text-sm text-gray-500">{reward.description}</p>
                      </div>
                      <Button 
                        variant={USER_PROFILE.points >= reward.points ? "default" : "outline"}
                        disabled={USER_PROFILE.points < reward.points}
                        size="sm"
                        className="min-w-[100px]"
                      >
                        {USER_PROFILE.points >= reward.points ? "Redeem" : `${reward.points} pts`}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5" />
                  Your Level & Benefits
                </CardTitle>
                <CardDescription>Current tier and upcoming benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TIER_BENEFITS.map((tier, index) => (
                    <div 
                      key={tier.level} 
                      className={`p-4 rounded-lg ${tier.level === USER_PROFILE.level 
                        ? 'border-2 border-gantry-purple bg-gantry-purple/5' 
                        : tier.level < USER_PROFILE.level 
                          ? 'bg-gray-50 opacity-75' 
                          : 'border border-gray-200'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                            tier.level <= USER_PROFILE.level ? 'bg-gantry-purple text-white' : 'bg-gray-200 text-gray-500'
                          }`}>
                            {tier.level}
                          </div>
                          <h3 className="font-semibold">{tier.title}</h3>
                        </div>
                        {tier.level === USER_PROFILE.level && (
                          <span className="bg-gantry-purple text-white text-xs px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{tier.pointsNeeded} points required</p>
                      <div className="flex flex-wrap gap-2">
                        {tier.benefits.map((benefit, i) => (
                          <span 
                            key={i} 
                            className={`text-xs px-2 py-1 rounded-full ${
                              tier.level <= USER_PROFILE.level 
                                ? 'bg-gantry-purple/10 text-gantry-purple-dark' 
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Active Challenges
                </CardTitle>
                <CardDescription>Complete these to earn more points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {CHALLENGES.map(challenge => (
                    <div key={challenge.id} className="pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">{challenge.title}</p>
                        <span className="text-sm font-semibold text-gantry-purple">+{challenge.points} pts</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{challenge.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div 
                          className="bg-gantry-purple h-2 rounded-full" 
                          style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Progress: {challenge.progress}/{challenge.total}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Referral Program
                </CardTitle>
                <CardDescription>Invite friends to earn points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="mb-2">Earn 100 points for each friend who signs up and completes their first order!</p>
                  <Button className="w-full">
                    Share Referral Link
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Ways to Earn
                </CardTitle>
                <CardDescription>More ways to collect points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Complete an order</p>
                      <p className="text-sm text-gray-500">Points based on order value</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Write a review</p>
                      <p className="text-sm text-gray-500">25 points per review</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Join a group buy</p>
                      <p className="text-sm text-gray-500">25 points per group buy</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Complete your profile</p>
                      <p className="text-sm text-gray-500">50 points one-time bonus</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PointsRewards;
