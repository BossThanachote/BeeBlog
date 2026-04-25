import Link from 'next/link';
import { Heart, MessageCircle, Repeat2 } from 'lucide-react';

// ดึงข้อมูลมารวมกันและเรียงตามวันที่
interface ActivityItem {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'REPOST';
  blogTitle: string;
  blogSlug: string;
  commentId?: string;
  snippet?: string;
  createdAt: string;
}

interface ShortBioCardProps {
  followingCount: number;
  followerCount: number;
}

export const ProfileActivityTab = ({ activities }: { activities: ActivityItem[] }) => {
  return (
    <div className="space-y-6">
      {activities.map((activity) => {
        // กำหนด URL ปลายทางตามประเภทกิจกรรม
        const targetUrl = activity.type === 'COMMENT'
          ? `/blog/${activity.blogSlug}#comment-${activity.commentId}`
          : `/blog/${activity.blogSlug}`;

        return (
          <div key={activity.id} className="border-b border-gray-100 pb-4">
            <Link href={targetUrl} className="group block">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                {activity.type === 'LIKE' && <><Heart className="w-4 h-4 text-red-500" /> กดถูกใจบล็อก</>}
                {activity.type === 'COMMENT' && <><MessageCircle className="w-4 h-4 text-blue-500" /> คอมเมนต์ในบล็อก</>}
                {activity.type === 'REPOST' && <><Repeat2 className="w-4 h-4 text-green-500" /> รีโพสต์บล็อก</>}
                <span>• {activity.createdAt}</span>
              </div>

              <h3 className="font-bold text-lg group-hover:text-yellow-600 transition-colors">
                {activity.blogTitle}
              </h3>

              {/* คอมเมนต์ โชว์ข้อความที่พิมพ์ */}
              {activity.type === 'COMMENT' && activity.snippet && (
                <div className="mt-2 pl-4 border-l-2 border-gray-200 text-gray-600 italic">
                  "{activity.snippet}"
                </div>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
};


export const ShortBioCard = ({ followingCount, followerCount }: ShortBioCardProps) => {
  return (
    <div className="flex items-center gap-4 mt-4 text-sm">
      <button className="hover:text-yellow-600 font-medium transition-colors flex items-baseline">
        <span className="font-bold text-black text-lg mr-1">{followingCount}</span>
        Following
      </button>
      <button className="hover:text-yellow-600 font-medium transition-colors flex items-baseline">
        <span className="font-bold text-black text-lg mr-1">{followerCount}</span>
        Followers
      </button>
    </div>
  );
};