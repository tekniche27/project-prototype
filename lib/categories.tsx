
const baseurl = "http://localhost:3000/api"

export async function getAllCategories() {
    const data = await fetch(`${baseurl}/categories`, { cache: 'no-store' })
  
    if (!data.ok) {
      throw new Error('Failed to fetch data')
    }
  
    return data.json()
  }

