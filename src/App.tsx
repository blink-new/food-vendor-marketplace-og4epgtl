import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Badge } from './components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar'
import { MapPin, Search, Star, Users, Building, ChefHat, ArrowRight, Calendar, Utensils, MessageCircle, Eye, X, ExternalLink, FileText, MapPinIcon, ThumbsUp, Quote, Shield, LogOut } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { AuthProvider } from './components/auth/AuthProvider'
import { useAuth } from './hooks/use-auth'
import { UserTypeSelection } from './components/auth/UserTypeSelection'
import { ChatModal } from './components/chat/ChatModal'
import { ChatTest } from './components/chat/ChatTest'

const UK_MAJOR_CITIES = [
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield',
  'Bradford', 'Liverpool', 'Edinburgh', 'Bristol', 'Cardiff', 'Leicester',
  'Coventry', 'Belfast', 'Nottingham', 'Newcastle', 'Brighton', 'Hull',
  'Plymouth', 'Stoke-on-Trent'
]

const CUISINE_TYPES = [
  'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'Mediterranean',
  'British', 'French', 'American', 'Korean', 'Vietnamese', 'Turkish', 'Lebanese', 'Caribbean'
]

const VENDOR_TYPES = [
  'Street Food', 'Restaurant', 'Catering', 'Pop-up', 'Food Truck', 'Bakery',
  'Cafe', 'Bar & Grill', 'Fast Casual', 'Fine Dining'
]

const FEATURED_VENDORS = [
  {
    id: 1,
    name: 'Mama\'s Authentic Curry',
    cuisine: 'Indian',
    rating: 4.9,
    reviewCount: 47,
    image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=100&h=100&fit=crop',
    vendorType: 'Restaurant',
    location: 'London',
    description: 'Traditional family recipes passed down through generations',
    availability: 'Available',
    lookingFor: 'Pub Kitchen, Restaurant Space',
    foodPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop',
        caption: 'Signature Butter Chicken',
        category: 'Main Course'
      },
      {
        url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
        caption: 'Fresh Naan Bread',
        category: 'Sides'
      }
    ]
  },
  {
    id: 2,
    name: 'Golden Dragon Kitchen',
    cuisine: 'Chinese',
    rating: 4.8,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1559847844-d721426d6edc?w=100&h=100&fit=crop',
    vendorType: 'Restaurant',
    location: 'Manchester',
    description: 'Authentic Cantonese cuisine with modern presentation',
    availability: 'Available',
    lookingFor: 'Restaurant Space, Food Court',
    foodPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=400&h=300&fit=crop',
        caption: 'Peking Duck',
        category: 'Main Course'
      },
      {
        url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop',
        caption: 'Dim Sum Selection',
        category: 'Appetizers'
      }
    ]
  },
  {
    id: 3,
    name: 'Artisan Pizza Kitchen',
    cuisine: 'Italian',
    rating: 4.7,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
    vendorType: 'Restaurant',
    location: 'Birmingham',
    description: 'Wood-fired pizzas made with imported Italian ingredients',
    availability: 'Available',
    lookingFor: 'Restaurant Space, Pub Kitchen',
    foodPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
        caption: 'Wood-Fired Margherita',
        category: 'Pizza'
      },
      {
        url: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop',
        caption: 'Fresh Pasta',
        category: 'Main Course'
      }
    ]
  },
  {
    id: 4,
    name: 'The Crown & Anchor',
    cuisine: 'British',
    rating: 4.6,
    reviewCount: 41,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop',
    vendorType: 'Pub',
    location: 'Leeds',
    description: 'Traditional British pub fare with locally sourced ingredients',
    availability: 'Available',
    lookingFor: 'Pub Space, Restaurant',
    foodPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop',
        caption: 'Fish & Chips',
        category: 'Main Course'
      },
      {
        url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
        caption: 'Shepherd\'s Pie',
        category: 'Main Course'
      }
    ]
  },
  {
    id: 5,
    name: 'Bangkok Street Kitchen',
    cuisine: 'Thai',
    rating: 4.8,
    reviewCount: 35,
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=100&h=100&fit=crop',
    vendorType: 'Street Food',
    location: 'Bristol',
    description: 'Authentic Thai street food with bold flavors and fresh herbs',
    availability: 'Available',
    lookingFor: 'Food Court, Takeaway',
    foodPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop',
        caption: 'Pad Thai',
        category: 'Main Course'
      },
      {
        url: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop',
        caption: 'Green Curry',
        category: 'Main Course'
      }
    ]
  },
  {
    id: 6,
    name: 'Street Taco Co.',
    cuisine: 'Mexican',
    rating: 4.7,
    reviewCount: 29,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
    vendorType: 'Street Food',
    location: 'Glasgow',
    description: 'Authentic Mexican street food with a modern twist',
    availability: 'Available',
    lookingFor: 'Food Court, Takeaway',
    foodPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        caption: 'Authentic Street Tacos',
        category: 'Main Course'
      },
      {
        url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop',
        caption: 'Fresh Guacamole',
        category: 'Sides'
      }
    ]
  },
  {
    id: 7,
    name: 'Istanbul Grill House',
    cuisine: 'Turkish',
    rating: 4.6,
    reviewCount: 44,
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=100&h=100&fit=crop',
    vendorType: 'Restaurant',
    location: 'Liverpool',
    description: 'Traditional Turkish grills and mezze in a warm atmosphere',
    availability: 'Available',
    lookingFor: 'Restaurant Space, Takeaway',
    foodPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop',
        caption: 'Mixed Grill Platter',
        category: 'Main Course'
      },
      {
        url: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=300&fit=crop',
        caption: 'Turkish Kebab',
        category: 'Main Course'
      }
    ]
  },
  {
    id: 8,
    name: 'Sakura Sushi Bar',
    cuisine: 'Japanese',
    rating: 4.9,
    reviewCount: 31,
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100&h=100&fit=crop',
    vendorType: 'Restaurant',
    location: 'Edinburgh',
    description: 'Fresh sushi and traditional Japanese dishes made by expert chefs',
    availability: 'Available',
    lookingFor: 'Restaurant Space, Bar',
    foodPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        caption: 'Sushi Selection',
        category: 'Main Course'
      },
      {
        url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400&h=300&fit=crop',
        caption: 'Ramen Bowl',
        category: 'Main Course'
      }
    ]
  },
  {
    id: 9,
    name: 'Le Petit Bistro',
    cuisine: 'French',
    rating: 4.5,
    reviewCount: 26,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop',
    vendorType: 'Restaurant',
    location: 'Cardiff',
    description: 'Classic French cuisine with seasonal ingredients and wine pairings',
    availability: 'Available',
    lookingFor: 'Restaurant Space, Wine Bar',
    foodPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        caption: 'Coq au Vin',
        category: 'Main Course'
      },
      {
        url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop',
        caption: 'French Onion Soup',
        category: 'Appetizers'
      }
    ]
  },
  {
    id: 10,
    name: 'Brooklyn Burger Co.',
    cuisine: 'American',
    rating: 4.4,
    reviewCount: 39,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop',
    vendorType: 'Fast Casual',
    location: 'Newcastle',
    description: 'Gourmet burgers and American classics with locally sourced beef',
    availability: 'Available',
    lookingFor: 'Food Court, Pub Kitchen',
    foodPhotos: [
      {
        url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        caption: 'Signature Burger',
        category: 'Main Course'
      },
      {
        url: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&h=300&fit=crop',
        caption: 'Loaded Fries',
        category: 'Sides'
      }
    ]
  }
]

// Vendor Profile Modal Component
function VendorProfileModal({ vendor, isOpen, onClose, onContactVendor }: { 
  vendor: any, 
  isOpen: boolean, 
  onClose: () => void,
  onContactVendor: (vendor: any) => void 
}) {
  if (!vendor) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={vendor.image} alt={vendor.name} />
              <AvatarFallback>{vendor.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{vendor.name}</h2>
              <p className="text-muted-foreground">{vendor.cuisine} • {vendor.vendorType}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Rating & Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-bold">{vendor.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(vendor.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{vendor.reviewCount} reviews</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Looking For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{vendor.lookingFor}</p>
                <Badge 
                  variant="secondary" 
                  className="mt-2 bg-green-100 text-green-800 border-green-200"
                >
                  {vendor.availability}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{vendor.description}</p>
            </CardContent>
          </Card>

          {/* Food Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Food Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendor.foodPhotos?.map((photo, index) => (
                  <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                      {photo.category}
                    </Badge>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                      <p className="text-sm font-medium">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button 
            className="flex-1"
            onClick={() => onContactVendor(vendor)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Vendor
          </Button>
          <Button variant="outline" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            Request Partnership
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AppContent() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth()
  const [searchLocation, setSearchLocation] = useState('')
  const [searchCuisine, setSearchCuisine] = useState('')
  const [searchVendorType, setSearchVendorType] = useState('')
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [chatVendor, setChatVendor] = useState(null)

  // Check if user has completed profile setup
  const userProfile = localStorage.getItem('userProfile')
  const hasCompletedProfile = userProfile && JSON.parse(userProfile).userType

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show user type selection if authenticated but no profile
  if (isAuthenticated && !hasCompletedProfile) {
    return (
      <UserTypeSelection onComplete={() => window.location.reload()} />
    )
  }

  const handleContactVendor = (vendor: any) => {
    if (!isAuthenticated) {
      login()
      return
    }
    setChatVendor(vendor)
  }

  const getUserDisplayInfo = () => {
    if (!userProfile) return null
    const profile = JSON.parse(userProfile)
    return {
      name: profile.displayName,
      type: profile.userType,
      company: profile.companyName
    }
  }

  const userInfo = getUserDisplayInfo()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/oya-logo.png" 
                alt="Oya Logo" 
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary font-medium"
                onClick={isAuthenticated ? undefined : login}
              >
                Register My Brand
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary font-medium"
                onClick={() => window.scrollTo({ top: document.getElementById('how-it-works')?.offsetTop || 0, behavior: 'smooth' })}
              >
                About Us
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground hover:text-primary font-medium"
                onClick={() => window.scrollTo({ top: document.getElementById('landlords-section')?.offsetTop || 0, behavior: 'smooth' })}
              >
                For Landlords
              </Button>
              {isAuthenticated && userInfo ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{userInfo.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userInfo.type}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={login}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>



      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?w=1920&h=1080&fit=crop')`
          }}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-primary">Oya's Food Pitch</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Connect to Thousands Of Food Vendors Looking To Trade In Your Space
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => window.scrollTo({ top: document.getElementById('featured-vendors')?.offsetTop || 0, behavior: 'smooth' })}
            >
              Browse Food Brands
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-background/10 border-background/30 text-white hover:bg-background/20 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm"
              onClick={login}
            >
              Sign Up Free
            </Button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Find Food Brands</h2>
                <p className="text-muted-foreground">Search for food vendors by cuisine type, location, and business model</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Vendor Type</label>
                  <Select value={searchVendorType} onValueChange={setSearchVendorType}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      {VENDOR_TYPES.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Cuisine</label>
                  <Select value={searchCuisine} onValueChange={setSearchCuisine}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Any cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {CUISINE_TYPES.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine.toLowerCase()}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <Select value={searchLocation} onValueChange={setSearchLocation}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {UK_MAJOR_CITIES.map((city) => (
                        <SelectItem key={city} value={city.toLowerCase()}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90">
                    <Search className="mr-2 h-4 w-4" />
                    Search Brands
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Food Vendors */}
      <section id="featured-vendors" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Food Vendors</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet talented food entrepreneurs ready to partner with your space
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_VENDORS.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={vendor.image} alt={vendor.name} />
                      <AvatarFallback>{vendor.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">{vendor.name}</h3>
                      <p className="text-muted-foreground">{vendor.cuisine} • {vendor.vendorType}</p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">{vendor.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">({vendor.reviewCount})</span>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      {vendor.availability}
                    </Badge>
                  </div>
                  
                  {/* Food Photos Preview */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {vendor.foodPhotos?.slice(0, 2).map((photo, index) => (
                      <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{vendor.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building className="h-4 w-4 mr-2" />
                      Looking for: {vendor.lookingFor}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      Location: {vendor.location}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleContactVendor(vendor)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedVendor(vendor)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Test Section - Temporary for testing */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Chat Test</h2>
            <p className="text-muted-foreground">Testing realtime chat functionality</p>
          </div>
          <ChatTest />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to find the perfect partner for your food space
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Browse Food Brands</h3>
              <p className="text-muted-foreground">
                Search Through Curated Food Vendors By Cuisine Type and Location
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <p className="text-muted-foreground">
                Connect with the brand via live chat. Oya are on hand to help
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Partner and Launch</h3>
              <p className="text-muted-foreground">
                Finalise your terms and launch your offering!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Food Journey Today
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of landlords using Oya's Food Pitch to transform spaces into bustling food hubs. Browse vetted vendors, read real reviews and connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-background text-foreground hover:bg-background/90 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg"
              onClick={() => window.scrollTo({ top: document.getElementById('featured-vendors')?.offsetTop || 0, behavior: 'smooth' })}
            >
              Browse Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-white/70 mt-4">
            No credit card required • Free to browse • Instant access
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/oya-logo.png" 
                  alt="Oya Logo" 
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Connecting landlords with talented food vendors across the UK. 
                Find your perfect food partner today.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Landlords</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Browse Food Brands</a></li>
                <li><a href="#" className="hover:text-primary">List Your Space</a></li>
                <li><a href="#" className="hover:text-primary">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">For Vendors</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Create Profile</a></li>
                <li><a href="#" className="hover:text-primary">Find Opportunities</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Oya. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VendorProfileModal 
        vendor={selectedVendor} 
        isOpen={!!selectedVendor} 
        onClose={() => setSelectedVendor(null)}
        onContactVendor={handleContactVendor}
      />
      
      {chatVendor && (
        <ChatModal
          isOpen={!!chatVendor}
          onClose={() => setChatVendor(null)}
          vendor={chatVendor}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App