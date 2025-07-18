import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Building, ChefHat, Phone, Globe, Instagram, Facebook } from 'lucide-react'
import { useAuth } from '../../hooks/use-auth'

const CUISINE_TYPES = [
  'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 'Mediterranean',
  'British', 'French', 'American', 'Korean', 'Vietnamese', 'Turkish', 'Lebanese', 'Caribbean'
]

const VENDOR_TYPES = [
  'Street Food', 'Restaurant', 'Catering', 'Pop-up', 'Food Truck', 'Bakery',
  'Cafe', 'Bar & Grill', 'Fast Casual', 'Fine Dining'
]

const UK_MAJOR_CITIES = [
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield',
  'Bradford', 'Liverpool', 'Edinburgh', 'Bristol', 'Cardiff', 'Leicester',
  'Coventry', 'Belfast', 'Nottingham', 'Newcastle', 'Brighton', 'Hull',
  'Plymouth', 'Stoke-on-Trent'
]

interface UserTypeSelectionProps {
  onComplete: () => void
}

export function UserTypeSelection({ onComplete }: UserTypeSelectionProps) {
  const { user } = useAuth()
  const [selectedType, setSelectedType] = useState<'landlord' | 'vendor' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Common fields
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  
  // Vendor-specific fields
  const [cuisineType, setCuisineType] = useState('')
  const [vendorType, setVendorType] = useState('')
  const [lookingFor, setLookingFor] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  
  // Landlord-specific fields
  const [propertyTypes, setPropertyTypes] = useState('')
  const [landlordLocations, setLandlordLocations] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType || !user) return

    setIsSubmitting(true)
    try {
      // For now, we'll store this in localStorage until database is set up
      const userData = {
        id: user.id,
        email: user.email,
        userType: selectedType,
        displayName,
        companyName,
        phone,
        location,
        bio,
        ...(selectedType === 'vendor' && {
          cuisineType,
          vendorType,
          lookingFor,
          websiteUrl,
          instagramUrl,
          facebookUrl,
        }),
        ...(selectedType === 'landlord' && {
          propertyTypes,
          landlordLocations,
        }),
        createdAt: new Date().toISOString(),
      }
      
      localStorage.setItem('userProfile', JSON.stringify(userData))
      onComplete()
    } catch (error) {
      console.error('Error saving user profile:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Oya's Food Pitch!</h1>
            <p className="text-muted-foreground">Let's set up your profile. Are you a landlord or food vendor?</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary"
              onClick={() => setSelectedType('landlord')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>I'm a Landlord</CardTitle>
                <CardDescription>
                  I have commercial space (pub, takeaway, restaurant) and want to find food vendors to partner with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Browse verified food vendors</li>
                  <li>• View portfolios and reviews</li>
                  <li>• Connect directly with vendors</li>
                  <li>• Manage partnership inquiries</li>
                </ul>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary"
              onClick={() => setSelectedType('vendor')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>I'm a Food Vendor</CardTitle>
                <CardDescription>
                  I have a food business and want to find commercial spaces to operate from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Create your food brand profile</li>
                  <li>• Showcase your cuisine and portfolio</li>
                  <li>• Connect with landlords</li>
                  <li>• Find partnership opportunities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {selectedType === 'landlord' ? 'Landlord Profile Setup' : 'Food Vendor Profile Setup'}
          </h1>
          <p className="text-muted-foreground">
            Tell us about yourself to help others find and connect with you
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedType === 'landlord' ? (
                <Building className="h-5 w-5" />
              ) : (
                <ChefHat className="h-5 w-5" />
              )}
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 20 1234 5678"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={location} onValueChange={setLocation} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      {UK_MAJOR_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">About {selectedType === 'landlord' ? 'Your Properties' : 'Your Food Business'}</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={
                    selectedType === 'landlord'
                      ? "Tell vendors about your properties, what you're looking for in a food partner..."
                      : "Describe your cuisine, experience, what makes your food special..."
                  }
                  rows={4}
                />
              </div>

              {/* Vendor-specific fields */}
              {selectedType === 'vendor' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cuisineType">Cuisine Type *</Label>
                      <Select value={cuisineType} onValueChange={setCuisineType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cuisine type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CUISINE_TYPES.map((cuisine) => (
                            <SelectItem key={cuisine} value={cuisine}>
                              {cuisine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vendorType">Business Type *</Label>
                      <Select value={vendorType} onValueChange={setVendorType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {VENDOR_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lookingFor">Looking For *</Label>
                    <Input
                      id="lookingFor"
                      value={lookingFor}
                      onChange={(e) => setLookingFor(e.target.value)}
                      placeholder="e.g., Pub Kitchen, Restaurant Space, Food Court"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Social Media & Website (Optional)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="Website URL"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={instagramUrl}
                            onChange={(e) => setInstagramUrl(e.target.value)}
                            placeholder="Instagram URL"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative">
                          <Facebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={facebookUrl}
                            onChange={(e) => setFacebookUrl(e.target.value)}
                            placeholder="Facebook URL"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Landlord-specific fields */}
              {selectedType === 'landlord' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="propertyTypes">Property Types</Label>
                    <Input
                      id="propertyTypes"
                      value={propertyTypes}
                      onChange={(e) => setPropertyTypes(e.target.value)}
                      placeholder="e.g., Pub, Restaurant, Takeaway, Food Court"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="landlordLocations">Additional Locations</Label>
                    <Input
                      id="landlordLocations"
                      value={landlordLocations}
                      onChange={(e) => setLandlordLocations(e.target.value)}
                      placeholder="Other cities where you have properties"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedType(null)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}