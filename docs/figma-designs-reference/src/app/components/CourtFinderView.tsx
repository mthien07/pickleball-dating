import { ArrowLeft, MapPin, Clock, Star, Phone } from "lucide-react";


interface Court {
  id: number;
  name: string;
  address: string;
  distance: number;
  rating: number;
  openTime: string;
  priceRange: string;
  image: string;
}

interface CourtFinderViewProps {
  onBack: () => void;
}

const mockCourts: Court[] = [
  {
    id: 1,
    name: "Sân Pickleball Thảo Điền",
    address: "123 Đường Xuân Thủy, Thảo Điền, Quận 2",
    distance: 1.5,
    rating: 4.8,
    openTime: "06:00 - 22:00",
    priceRange: "150k - 300k/h",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400",
  },
  {
    id: 2,
    name: "Sân Pickleball Phú Nhuận",
    address: "456 Phan Xích Long, Phú Nhuận",
    distance: 3.2,
    rating: 4.5,
    openTime: "05:30 - 23:00",
    priceRange: "120k - 250k/h",
    image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=400",
  },
  {
    id: 3,
    name: "CLB Pickleball Sài Gòn",
    address: "789 Võ Văn Tần, Quận 3",
    distance: 5.0,
    rating: 4.9,
    openTime: "24/7",
    priceRange: "200k - 400k/h",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400",
  },
];

export function CourtFinderView({ onBack }: CourtFinderViewProps) {
  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Header */}
      <div className="sticky top-0 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-white/10 p-4 flex items-center gap-4 z-10">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl text-white">Sân gần bạn</h1>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm sân gần bạn..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-full outline-none focus:border-red-500 transition-colors text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Courts list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockCourts.map((court) => (
          <div
            key={court.id}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors"
          >
            {/* Court image */}
            <div className="relative h-40">
              <img
                src={court.image}
                alt={court.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                    <MapPin className="w-3 h-3 text-white" />
                    <span className="text-xs text-white">
                      {court.distance} km
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white">{court.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Court info */}
            <div className="p-4">
              <h3 className="text-white mb-2">{court.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{court.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{court.openTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Giá:</span>
                  <span className="text-green-400">{court.priceRange}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 h-10 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 transition-colors text-sm flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Gọi ngay
                </button>
                <button className="flex-1 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-white hover:from-green-600 hover:to-emerald-600 transition-colors text-sm">
                  Đặt sân
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
