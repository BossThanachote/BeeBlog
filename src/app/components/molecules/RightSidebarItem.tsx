import { UserPlus } from 'lucide-react';

interface PopularItemProps {
  title: string;
  category: string;
}

export const PopularItem = ({ title, category }: PopularItemProps) => (
  <div className="group cursor-pointer">
    <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider mb-1">{category}</p>
    <h4 className="text-sm font-bold group-hover:text-yellow-600 transition-colors line-clamp-1">{title}</h4>
  </div>
);

interface AuthorItemProps {
  name: string;
  bio: string;
  avatar: string;
}

export const AuthorItem = ({ name, bio, avatar }: AuthorItemProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
        <img src={avatar} alt={name} />
      </div>
      <div>
        <h4 className="text-sm font-bold">{name}</h4>
        <p className="text-[10px] text-gray-400">{bio}</p>
      </div>
    </div>
    <button className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors">
      <UserPlus className="w-5 h-5" />
    </button>
  </div>
);