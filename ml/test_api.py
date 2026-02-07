"""
Test Script for Angina Pektoris Detection API
==============================================

This script demonstrates how to use the API endpoints
and tests various scenarios.

Usage:
    1. Start the API first: uvicorn api:app --reload
    2. Run this script: python test_api.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

# Test patient data
TEST_PATIENT_HIGH_RISK = {
    "usia": 68,
    "jenis_kelamin": "L",
    "TD": 180,
    "riwayat_DM": "Ya",
    "HT": "Ya",
    "riwayat_PJK_terdahulu": "Ya",
    "nyeri_dada_menjalar_ke_lengan": "Ya",
    "durasi_nyeri": "30 menit",
    "sesak_napas": "Ya",
    "mual": "Ya",
    "muntah": "Tidak",
    "keringat_dingin": "Ya"
}

TEST_PATIENT_LOW_RISK = {
    "usia": 25,
    "jenis_kelamin": "P",
    "TD": 110,
    "riwayat_DM": "Tidak",
    "HT": "Tidak",
    "riwayat_PJK_terdahulu": "Tidak",
    "nyeri_dada_menjalar_ke_lengan": "Tidak",
    "durasi_nyeri": "2 menit",
    "sesak_napas": "Tidak",
    "mual": "Tidak",
    "muntah": "Tidak",
    "keringat_dingin": "Tidak"
}

TEST_PATIENT_MODERATE = {
    "usia": 55,
    "jenis_kelamin": "P",
    "TD": 140,
    "riwayat_DM": "Tidak",
    "HT": "Ya",
    "riwayat_PJK_terdahulu": "Tidak",
    "nyeri_dada_menjalar_ke_lengan": "Ya",
    "durasi_nyeri": "5 menit",
    "sesak_napas": "Ya",
    "mual": "Tidak",
    "muntah": "Tidak",
    "keringat_dingin": "Tidak"
}


def test_health_endpoint():
    """Test the health check endpoint."""
    print("=" * 60)
    print("TEST 1: Health Check")
    print("=" * 60)
    
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_root_endpoint():
    """Test the root endpoint."""
    print("\n" + "=" * 60)
    print("TEST 2: Root Endpoint (API Info)")
    print("=" * 60)
    
    try:
        response = requests.get(BASE_URL)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_prediction(patient_data, description):
    """Test prediction endpoint with given patient data."""
    print("\n" + "=" * 60)
    print(f"TEST: Prediction - {description}")
    print("=" * 60)
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json=patient_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n📊 Prediction Result:")
            print(f"   Prediction: {result['prediction']}")
            print(f"   Probability Angina: {result['probability_angina']:.2%}")
            print(f"   Probability Non-Angina: {result['probability_non_angina']:.2%}")
            print(f"   Risk Level: {result['risk_level']}")
            print(f"   Risk Percentage: {result['risk_percentage']}%")
            print(f"   Confidence: {result['confidence']}")
            print(f"\n   Full Response:")
            print(json.dumps(result, indent=2))
            return True
        else:
            print(f"❌ Error Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_batch_prediction():
    """Test batch prediction endpoint."""
    print("\n" + "=" * 60)
    print("TEST: Batch Prediction")
    print("=" * 60)
    
    batch_data = [
        TEST_PATIENT_HIGH_RISK,
        TEST_PATIENT_LOW_RISK,
        TEST_PATIENT_MODERATE
    ]
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict/batch",
            json=batch_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"\n📊 Batch Results:")
            print(f"   Total Patients: {result['batch_size']}")
            print(f"   Successful: {result['successful_predictions']}")
            print(f"   Failed: {result['failed_predictions']}")
            print(f"\n   Individual Results:")
            for r in result['results']:
                print(f"   - Patient {r['patient_index']}: {r.get('prediction', 'ERROR')} "
                      f"(Risk: {r.get('risk_level', 'N/A')})")
            return True
        else:
            print(f"❌ Error Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_invalid_data():
    """Test prediction with invalid data."""
    print("\n" + "=" * 60)
    print("TEST: Invalid Data Handling")
    print("=" * 60)
    
    invalid_data = {
        "usia": 150,  # Invalid: too old
        "jenis_kelamin": "X",  # Invalid: not L or P
        # Missing required fields
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json=invalid_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Should return 422 validation error
        return response.status_code == 422
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    """Run all tests."""
    print("\n" + "🫀" * 30)
    print("ANGINA PEKTORIS DETECTION API - TEST SUITE")
    print("🫀" * 30 + "\n")
    
    # Check if API is running
    print("Checking if API is running...")
    try:
        requests.get(BASE_URL, timeout=2)
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: API is not running!")
        print("   Please start the API first with:")
        print("   uvicorn api:app --reload")
        return
    
    # Run tests
    results = []
    
    results.append(("Health Check", test_health_endpoint()))
    results.append(("Root Endpoint", test_root_endpoint()))
    results.append(("Prediction - High Risk", test_prediction(TEST_PATIENT_HIGH_RISK, "High Risk Patient")))
    results.append(("Prediction - Low Risk", test_prediction(TEST_PATIENT_LOW_RISK, "Low Risk Patient")))
    results.append(("Prediction - Moderate Risk", test_prediction(TEST_PATIENT_MODERATE, "Moderate Risk Patient")))
    results.append(("Batch Prediction", test_batch_prediction()))
    results.append(("Invalid Data Handling", test_invalid_data()))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {status}: {test_name}")
    
    print(f"\n   Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")


if __name__ == "__main__":
    main()
