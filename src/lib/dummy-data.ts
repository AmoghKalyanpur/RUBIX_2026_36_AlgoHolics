interface TimeSeriesEntry {
  "4. close": string;
}

interface TimeSeries {
  [key: string]: TimeSeriesEntry;
}

function generateTimeSeries(basePrice: number, volatility: number, days: number): TimeSeries {
  const timeSeries: TimeSeries = {};
  let currentDate = new Date();
  for (let i = 0; i < days; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const trend = (i / days) * (volatility * (Math.random() * 0.5));
    const price = basePrice + (Math.random() - 0.5) * volatility - trend;
    timeSeries[dateStr] = { "4. close": price.toFixed(2) };
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return timeSeries;
}

function addCompanyMetrics(basePrice: number, description: string) {
    const week52Low = (basePrice * (Math.random() * 0.2 + 0.8)).toFixed(2);
    const week52High = (basePrice * (Math.random() * 0.3 + 1.1)).toFixed(2);
    const currentPrice = (parseFloat(week52Low) + Math.random() * (parseFloat(week52High) - parseFloat(week52Low))).toFixed(2);

    return {
        "globalQuote": {
            "08. previous close": (parseFloat(currentPrice) * (Math.random() * 0.04 + 0.98)).toFixed(2),
            "01. symbol": "",
            "05. price": currentPrice,
        },
        "marketCap": `${(Math.random() * 5 + 1).toFixed(2)}T`,
        "peRatio": (Math.random() * 50 + 15).toFixed(2),
        "week52High": week52High,
        "week52Low": week52Low,
        "description": description
    };
}

export const dummyData: { [key: string]: any } = {
  "TCS.NS": { ...addCompanyMetrics(3850, "Tata Consultancy Services (TCS) is an Indian multinational IT services and consulting company, founded in 1968 by Tata Sons. As a global leader in IT services, consulting, and business solutions, it operates in 46 countries."), timeSeries: generateTimeSeries(3850, 50, 100) },
  "INFY.NS": { ...addCompanyMetrics(1550, "Infosys Limited, founded in 1981 by N. R. Narayana Murthy and six other engineers, is a global leader in next-generation digital services and consulting. It is headquartered in Bangalore, India."), timeSeries: generateTimeSeries(1550, 40, 100) },
  "WIPRO.NS": { ...addCompanyMetrics(480, "Wipro Limited was founded in 1945 by Mohamed Premji. It is a leading global information technology, consulting, and business process services company, initially started as a vegetable oil manufacturer."), timeSeries: generateTimeSeries(480, 15, 100) },
  "HCLTECH.NS": { ...addCompanyMetrics(1430, "HCL Technologies, founded in 1976 by Shiv Nadar, is an Indian multinational IT services company. It is a next-generation global technology company that helps enterprises reimagine their businesses for the digital age."), timeSeries: generateTimeSeries(1430, 35, 100) },
  "HDFCBANK.NS": { ...addCompanyMetrics(1530, "HDFC Bank, incorporated in 1994, is one of India’s leading private banks. It provides a wide range of financial products and services to its customers across India."), timeSeries: generateTimeSeries(1530, 45, 100) },
  "ICICIBANK.NS": { ...addCompanyMetrics(1120, "ICICI Bank was established by the Industrial Credit and Investment Corporation of India (ICICI) in 1994. It is a leading private sector bank in India, offering a wide range of banking products and financial services."), timeSeries: generateTimeSeries(1120, 30, 100) },
  "SBIN.NS": { ...addCompanyMetrics(830, "State Bank of India (SBI) is an Indian multinational, public sector banking and financial services statutory body. It is the largest bank in India, with its origins tracing back to the Bank of Calcutta in 1806."), timeSeries: generateTimeSeries(830, 25, 100) },
  "KOTAKBANK.NS": { ...addCompanyMetrics(1720, "Kotak Mahindra Bank, founded by Uday Kotak in 2003, provides a wide range of banking and financial services. It is known for its comprehensive portfolio of financial solutions."), timeSeries: generateTimeSeries(1720, 50, 100) },
  "AXISBANK.NS": { ...addCompanyMetrics(1160, "Axis Bank is the third largest private sector bank in India, founded in 1993 as UTI Bank. The bank offers the entire spectrum of financial services to customer segments covering Large and Mid-Corporates, MSME, Agriculture and Retail Businesses."), timeSeries: generateTimeSeries(1160, 38, 100) },
  "RELIANCE.NS": { ...addCompanyMetrics(2950, "Reliance Industries Limited (RIL), founded by Dhirubhai Ambani in 1966, is an Indian multinational conglomerate company. Its diverse businesses include energy, petrochemicals, retail, telecommunications, and media."), timeSeries: generateTimeSeries(2950, 80, 100) },
  "HINDUNILVR.NS": { ...addCompanyMetrics(2450, "Hindustan Unilever Limited (HUL), founded in 1933, is a British-Dutch manufacturing company. It is a subsidiary of Unilever, one of the world's leading suppliers of Food, Home Care, Personal Care and Refreshment products."), timeSeries: generateTimeSeries(2450, 60, 100) },
  "ITC.NS": { ...addCompanyMetrics(430, "ITC Limited, established in 1910, is an Indian conglomerate with businesses spanning FMCG, Hotels, Paperboards & Packaging, Agri-Business, and Information Technology. It was originally established as the Imperial Tobacco Company of India."), timeSeries: generateTimeSeries(430, 10, 100) },
  "NESTLEIND.NS": { ...addCompanyMetrics(2530, "Nestlé India is the Indian subsidiary of Nestlé of Switzerland. The company was incorporated in 1959 and has been a leader in the food processing industry in India, known for brands like Maggi, Nescafé, and KitKat."), timeSeries: generateTimeSeries(2530, 70, 100) },
  "TATAMOTORS.NS": { ...addCompanyMetrics(975, "Tata Motors, part of the Tata Group, was founded in 1945. It is a leading global automobile manufacturing company, producing cars, trucks, buses, and defense vehicles."), timeSeries: generateTimeSeries(975, 40, 100) },
  "MARUTI.NS": { ...addCompanyMetrics(12800, "Maruti Suzuki India Limited was founded in 1981 and is the Indian subsidiary of Japanese automaker Suzuki. It is the largest passenger car company in India, known for its affordable and fuel-efficient vehicles."), timeSeries: generateTimeSeries(12800, 200, 100) },
  "M&M.NS": { ...addCompanyMetrics(2550, "Mahindra & Mahindra, founded in 1945 by J.C. Mahindra, K.C. Mahindra, and Malik Ghulam Muhammad, is an Indian multinational conglomerate. It is best known for its leadership in the utility vehicle and tractor segments."), timeSeries: generateTimeSeries(2550, 90, 100) },
  "SUNPHARMA.NS": { ...addCompanyMetrics(1500, "Sun Pharmaceutical Industries, founded by Dilip Shanghvi in 1983, is an Indian multinational pharmaceutical company. It is the largest pharmaceutical company in India and the fourth largest specialty generic pharmaceutical company in the world."), timeSeries: generateTimeSeries(1500, 55, 100) },
  "DRREDDY.NS": { ...addCompanyMetrics(6200, "Dr. Reddy's Laboratories, founded in 1984 by Kallam Anji Reddy, is an Indian multinational pharmaceutical company. The company manufactures and markets a wide range of pharmaceuticals in India and overseas."), timeSeries: generateTimeSeries(6200, 150, 100) },
  "CIPLA.NS": { ...addCompanyMetrics(1480, "Cipla, founded by Khwaja Abdul Hamied in 1935, is an Indian multinational pharmaceutical company. It is primarily known for developing medicines to treat respiratory, cardiovascular disease, arthritis, diabetes, and other medical conditions."), timeSeries: generateTimeSeries(1480, 40, 100) },
  "BHARTIARTL.NS": { ...addCompanyMetrics(1380, "Bharti Airtel, founded by Sunil Bharti Mittal in 1995, is a leading global telecommunications company. It operates in 18 countries across South Asia and Africa."), timeSeries: generateTimeSeries(1380, 45, 100) },
  "ASIANPAINT.NS": { ...addCompanyMetrics(2900, "Asian Paints, founded in 1942 by four friends, is an Indian multinational paint company. It is India's largest and Asia's third-largest paint company, providing a wide range of painting and waterproofing solutions."), timeSeries: generateTimeSeries(2900, 80, 100) },
  "BAJFINANCE.NS": { ...addCompanyMetrics(6800, "Bajaj Finance Limited, part of the Bajaj Finserv group, is one of India’s leading non-banking financial companies (NBFC). It is primarily engaged in the business of lending and accepts public and corporate deposits."), timeSeries: generateTimeSeries(6800, 250, 100) },
  "INDIGO.NS": { ...addCompanyMetrics(4300, "IndiGo is a low-cost airline headquartered in Gurgaon, India. It was founded in 2006 by Rahul Bhatia and Rakesh Gangwal. It is the largest airline in India by passengers carried and fleet size."), timeSeries: generateTimeSeries(4300, 120, 100) },
  "ADANIENT.NS": { ...addCompanyMetrics(3250, "Adani Enterprises, the flagship company of the Adani Group, was founded by Gautam Adani in 1988 as a commodity trading firm. It has since diversified into resources, logistics, energy, and agri-business."), timeSeries: generateTimeSeries(3250, 150, 100) }
};