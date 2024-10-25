import { StyleSheet } from "react-native";

const styles=StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
      },
      textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      },
      smallIcon: {
        marginRight: 20,
        fontSize: 24,
      },
      logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        height: 260,
        width: 260,
        marginTop: 30,
      },
      text_footer: {
        color: '#05375a',
        fontSize: 28,
      },
      action: {
        flexDirection: 'row',
        // paddingTop: 10,
        // paddingBottom: 3,
        // marginTop: 15,
    
        // paddingHorizontal: 15,
    
        // borderWidth: 1,
        // borderColor: '#16423C',
        // borderRadius: 50,

        width:320,
        marginTop:15,
        borderBlockColor:'#BEBEBE',
        borderBottomWidth:1,
        paddingBottom:10,
        fontFamily:'GeezaPro-Bold',
        fontSize:15,
      },
      textInput: {
        flex: 1,
        marginTop: -12,
    
        // color: '#05375a',
      },
      loginContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
        
      },
      loginContainer1: {
        marginTop:'40%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingVertical: 30,
      },
      header: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
      },
      text_header: {
        textAlign:'center',
        color: '#16423C',
        fontWeight: 'bold',
        fontSize: 30,
      },
      button: {
        alignItems: 'center',
        marginTop: -20,
        alignItems: 'center',
        textAlign: 'center',
        margin: 20,
      },
      btn: {
        width: '50%',
        backgroundColor: '#16423C',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
      },
      btn1:{
        width: '50%',
        marginTop:50,
        backgroundColor: '#16423C',
        padding:15,
        marginLeft:'auto',
        marginRight:'auto',
        alignItems: 'center',
        borderRadius: 6,
      },
      inBut2: {
        backgroundColor: '#16423C',
        height: 65,
        width: 65,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
      bottomButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      smallIcon2: {
        fontSize: 40,
        // marginRight: 10,
      },
      bottomText: {
        color: 'black',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
      },
      radioButton_div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:20
      },
      radioButton_inner_div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      radioButton_title: {
        fontSize: 20,
        color: '#16423C',
      },
      radioButton_text: {
        fontSize: 16,
        color: 'black',
      },
})

export default styles;