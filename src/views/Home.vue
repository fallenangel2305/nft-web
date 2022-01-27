<template>
  <div class="home">
    <FormulateInput
      type="button"
      label="Connect wallet"
      @click="walletHandler"
    />
    <div class="pub_key">
      {{ publicKey }}
    </div>
    <FormulateForm class="form" v-model="formValues" @submit="submitHandler">
      <FormulateInput
        name="nft_name"
        type="text"
        label="NFT Name"
        placeholder="APE NFT"
        validation="required"
      />
      <FormulateInput
        name="nft_symbol"
        type="text"
        label="NFT Symbol"
        placeholder="APE"
        validation="required"
      />
      <FormulateInput
        name="nft_description"
        type="textarea"
        label="NFT Description"
        placeholder="It is an APE NFT"
        validation="required"
      />

      <FormulateInput
        type="image"
        name="file"
        v-model="image"
        label="Select an image to upload"
        help="Select a png, jpg or gif to upload."
        validation="required|mime:image/jpeg,image/png,image/gif"
        :uploader="() => {}"
      />

      <FormulateInput type="submit" label="Mint" />
    </FormulateForm>

    <textarea class="text-area" v-model="nftData" placeholder="Output" />
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      formValues: {},
      image: null,
      publicKey: null,
      nftData: null,
    };
  },
  methods: {
    async submitHandler(data) {
      const imgdata = new FormData();
      console.log(data);
      imgdata.append("file", this.image.files[0].file);

      await axios
        .post("https://testdoc.mvp-apps.ae/upload.php", imgdata)
        .then((response) => {
          if (window.solana.isConnected) {
            this.mint_nft(response.data);
          } else {
            alert("Wallet not conneted");
          }
        })
        .catch((error) => console.error(error));
    },

    async walletHandler() {
      try {
        const resp = await window.solana.connect();
        this.publicKey = resp.publicKey.toString();
        console.log(this.publicKey);

        // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
        console.log(err);
      }
      console.log(window.solana.isConnected);
    },
    mint_nft(data) {
      this.nftData = null;
      var API_KEY_ID = "hqgpXOUQxWNBM4I";
      var API_SECRET_KEY = "jNLCPsSyXTvCSYP";
      var PRIVATE_KEY = [
        106, 173, 191, 4, 209, 213, 118, 210, 220, 135, 182, 54, 90, 84, 66,
        100, 158, 212, 138, 243, 81, 252, 186, 151, 142, 124, 47, 236, 230, 48,
        117, 90, 31, 75, 62, 5, 47, 214, 31, 151, 159, 137, 174, 248, 121, 64,
        74, 183, 200, 66, 226, 19, 222, 246, 236, 227, 111, 11, 98, 220, 32, 79,
        89, 42,
      ];

      var MINT_NFT_ENDPOINT = "https://api.theblockchainapi.com/v1/solana/nft";

      var HEADERS = {
        APIKeyID: API_KEY_ID,
        APISecretKey: API_SECRET_KEY,
      };

      var BODY = {
        wallet: {
          private_key: PRIVATE_KEY,
        },

        //"derivation_path": DERIVATION_PATH,
        nft_name: this.formValues.nft_name,
        nft_symbol: this.formValues.nft_symbol,
        nft_description: this.formValues.nft_description,
        nft_url: data.url,
        mint_to_public_key: this.publicKey,
        network: "devnet",
        nft_upload_method: "S3",
      };
      console.log(BODY);

      fetch(MINT_NFT_ENDPOINT, {
        method: "POST",
        body: JSON.stringify(BODY),
        headers: HEADERS,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(JSON.stringify(data, undefined, 2));
          this.nftData = JSON.stringify(data, undefined, 2);
        })
        .catch((error) => {
          console.log(JSON.stringify(error, undefined, 2));
          this.nftData = JSON.stringify(error, undefined, 2);
          this.errors.push(error);
        });
    },
  },
};
</script>

<style scoped>
.login-form {
  margin: auto;
  text-align: left;
}
.home {
  margin: auto;
  text-align: left;
  max-width: 520px;
}
.pub_key {
  color: black;
  font-family: "Times New Roman", Times, serif;
}
.text-area {
  color: green;
  background-color: white;
  line-height: 1.2;
  min-height: 480px;
  min-width: 520px;
  padding: 10px 10px;
  margin: 5px;
}
</style>
