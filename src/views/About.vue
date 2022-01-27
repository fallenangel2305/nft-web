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
      />

      <FormulateInput type="submit" label="View NFT" />
    </FormulateForm>

    <div id="board">
      <div id="images-container">
        <div id="image-out">
          <div id="image-in">
            <img src="images/image10.jpg" />
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
export default {
  methods: {
    async test() {
      try {
        // const address = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy;
        // or use Solana Domain
        const address = this.formValues.wallet_address;

        const publicAddress = await resolveToWalletAddress({
          text: address,
        });
        const nftArray = await getParsedNftAccountsByOwner({
          publicAddress,
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
              //cereates an image element
              let img = document.createElement("img");
              //adds image to the image element
              img.src = images.replace(/['"]+/g, "");
              imageIn.appendChild(img);
              imageOut.appendChild(imageIn);
              document.querySelector("#images-container").appendChild(imageOut);
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
  max-width: 250px;
  text-align: left;
}
#image-out {
  display: inline-block;
  width: 250px;
  margin: 2px 0;
}
#image-in {
  width: 250px;
  margin: 0;
}
#image-in img {
  height: 250px;
  width: 250px;
}
</style>
