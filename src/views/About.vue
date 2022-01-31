<template>
  <div class="about">
    <h1>View your nft here</h1>
    <FormulateForm class="form" v-model="formValues" @submit="test">
      <FormulateInput
        name="wallet_address"
        type="text"
        label="NFT Wallet Address"
        placeholder="BJ5sBNC7QVRnnUrqqkUuipRAVWPS3HPJapafUyrc3Mxd"
        validation="required"
        value= 123
      />

      <FormulateInput type="submit" label="View NFT" />
    </FormulateForm>

    <div id="board">
      <div id="images-container">
        <div id="image-out">
          <div id="image-in">
            <img
              id="imgs"
              src="https://coingeek.com/wp-content/uploads/2021/04/nfts-and-stas-token-the-race-to-tokenize-everything.jpg"
              hidden
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import axios from "axios";
import { Connection } from "@solana/web3.js";
export default {
  methods: {
    async test() {
      try {
        // const address = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy;
        // or use Solana Domain
        const address = this.formValues.wallet_address;
        const connection = new Connection("https://api.devnet.solana.com/");
        const publicAddress = await resolveToWalletAddress({
          text: address,
        });
        const nftArray = await getParsedNftAccountsByOwner({
          publicAddress,
          connection,
        });
        for (var i = 0; i <= nftArray.length; i++) {
          var uri = nftArray[i].data["uri"];
          //console.log(uri);
          await axios
            .get(uri)
            .then((response) => {
              var images = JSON.stringify(response.data["image"]);
              console.log(images);
              //creates a div element
              let imageOut = document.createElement("div");
              //sets the id of the div
              imageOut.setAttribute("id", "image-out");
              let imageIn = document.createElement("div");
              imageIn.setAttribute("id", "image-in");
              //creates an image element
              let img = document.createElement("img");
              img.setAttribute("width", 250);

              //adds image to the image element
              img.src = images.replace(/['"]+/g, "");

              imageIn.appendChild(img);
              imageOut.appendChild(imageIn);
              document.querySelector("#images-container").appendChild(imageOut);
              setTimeout(500);
            })
            .catch((error) => console.error(error));
        }
      } catch (error) {
        console.log("Error thrown, while fetching NFTs", error.message);
      }
    },
  },
};
</script>

<style scoped>
.form {
  max-width: 520px;
  text-align: left;
}
#board {
  margin: 20px;
  max-width: 100px;
  text-align: center;
}
#image-out {
  display: inline-block;
  width: 100px;
  margin: 2px 0;
}
#image-in {
  width: 100px;
  margin: 0;
}
#image-in img {
  height: 100px;
  width: 100px;
}
img {
  height: 100px;
  width: 100px;
}
</style>
