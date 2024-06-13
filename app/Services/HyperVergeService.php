<?php
namespace App\Services;

use App\Interfaces\IKycProvider;
use App\Utilities\ExternalApiCalls;
use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class HyperVergeService implements IKycProvider
{
	private $api;

	public function __construct() {
		$this->setup();
	}

	/**
	 * Setup the kyc provider.
	 */
	public function setup()
	{
		$this->api = new Client([
			'headers' => [
				'Content-Type' => 'application/json',
				'Accept' => 'application/json',
			]
		]);
	}

	/**
	 * Provide authentication token
	 * 
	 * return string
	 */
	public function generateToken(): string
	{
		try {
			$response = $this->api->post('https://auth.hyperverge.co/login', [
				'json' => [
					'appId' => config('hyperverge.appId'),
					'appKey' => config('hyperverge.appKey'),
					'expiry' => config('hyperverge.expiry'),
				]
			]);
			
			if ($response->getStatusCode() == 200) {
				$response = json_decode($response->getBody()->getContents());
				return $response->result->token;
			} else {
				Log::error(json_encode($response));
			}
		} catch (RequestException $e) {
			Log::error($e->getMessage());
		}
		return '';
	}

	// Part 2 - Verification at client’s backend (optional - client has to implement this):
	// 	* Client App extracts E(X-HV-Response-Signature), image & response(R) - sends it to Client backend
	// 	* Client backend computes MD5 hash(H) of the image.
	// 	* Client backend generates HmacSHA256 hash of the response using MD5(H) as the key
	// 	* HmacSHA256(R, H) = H1
	// 	* Client backend decrypts E with the public key it has and gets H2
	// 	* RSADecrypt(E, public_key) = H2
	// 	* Client backend checks if H1 = H2
	// 	Some specific details:
	// 	* Hashing of the image in the SDK: "MD5"
	// 	* Hashing of (image hash + salt) and the response: "HmacSHA256"
	// 	* Encryption and decryption algorithm(using the public-private keys): "RSA"
	// 	* Contact HyperVerge for the public key that should be used to decrypt the signature.
		

	/**
	 * Verify result
	 * 
	 * @param array $result
	 */
	public function verifyResult(array $result): bool
	{
		$public_key = config('hyperverge.publicKey');

		$signature = $result['X-HV-Response-Signature'];
		$image = $result['image'];
		$response = $result['response'];

		$hash = md5($image);
		$hmac = hash_hmac('sha256', $response, $hash); //h1
		$decrypted = openssl_decrypt($signature, 'RSA', $public_key); //h2

		return $hmac == $decrypted;
	}


}
