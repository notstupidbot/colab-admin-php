from g2p_id import G2P
import sys
import mimetypes
def main():
    mimetypes._winreg = None
    if len(sys.argv) > 1:
    	input_text = sys.argv[1] 
    	g2p = G2P()
    	output_text = g2p(input_text)
    	print(output_text)

if __name__ == "__main__":
	main()